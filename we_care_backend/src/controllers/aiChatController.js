const Groq = require("groq-sdk");
const doctorModel = require("../models/doctorModel");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper: Get doctors by specialization with ratings
const getDoctorsBySpecialization = async (specialization, limit = 5) => {
  const doctors = await doctorModel.aggregate([
    {
      $match: {
        specialization: { $regex: specialization, $options: "i" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "doctorId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: {
          $cond: [
            { $gt: [{ $size: "$reviews" }, 0] },
            { $avg: "$reviews.rating" },
            0,
          ],
        },
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: { averageRating: -1, experience: -1 }
    },
    {
      $limit: limit
    },
    {
      $project: {
        _id: 1,
        specialization: 1,
        experience: 1,
        hospital: 1,
        fees: 1,
        verified: 1,
        profileImage: 1,
        averageRating: 1,
        reviewCount: 1,
        "user.name": 1,
        "user.email": 1,
        "user.phone": 1,
      },
    },
  ]);

  return doctors;
};

// Helper: Get all available specializations
const getAllSpecializations = async () => {
  const specializations = await doctorModel.distinct("specialization");
  return specializations;
};

const cleanJSONResponse = (text) => {
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  cleaned = cleaned.trim();
  return cleaned;
};

// SAFE Chat endpoint
exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message"
      });
    }

    const availableSpecializations = await getAllSpecializations();

    const prompt = `Analyze this patient message: "${message}"

Available specialists: ${availableSpecializations.join(", ")}

Return ONLY raw JSON (no markdown, no backticks, no explanation) with these fields:

{
  "reply": "2-3 sentence empathetic response. Ask 1 relevant question.",
  "possible_cause": "Brief possible cause (5-10 words max)",
  "specialist": "Best match from available specialists or 'General Physician'",
  "urgency": "low/medium/high",
  "home_care": ["2-3 natural remedies only"],
  "when_to_see_doctor": "1 sentence guidance"
}

RULES:
- NO medication names
- NO alarming diagnoses
- ONLY natural home remedies
- Return ONLY valid JSON, nothing else`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a medical assistant. Return ONLY valid JSON. No markdown, no backticks, no extra text. Just the JSON object."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    let aiResponseText = completion.choices[0]?.message?.content || "{}";
    
    aiResponseText = cleanJSONResponse(aiResponseText);
    
    let aiResponse;
    try {
      aiResponse = JSON.parse(aiResponseText);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw response:", aiResponseText);
      aiResponse = {
        reply: "I understand you're not feeling well. Could you tell me more about your symptoms?",
        possible_cause: "Various possibilities exist",
        specialist: "General Physician",
        urgency: "medium",
        home_care: ["Get plenty of rest", "Stay hydrated"],
        when_to_see_doctor: "Please consult a doctor for proper diagnosis"
      };
    }

    // Get doctors for the specialist
    let doctors = [];
    if (aiResponse.specialist) {
      doctors = await getDoctorsBySpecialization(aiResponse.specialist, 5);
    }

    // If no doctors found, get general physicians
    if (doctors.length === 0) {
      doctors = await getDoctorsBySpecialization("General Physician", 5);
    }

    // Send well-formatted, balanced response
    res.json({
      success: true,
      reply: aiResponse.reply,
      possible_cause: aiResponse.possible_cause,
      specialist: aiResponse.specialist,
      urgency: aiResponse.urgency,
      home_care: aiResponse.home_care || ["Rest", "Stay hydrated", "Consult doctor if symptoms persist"],
      when_to_see_doctor: aiResponse.when_to_see_doctor,
      disclaimer: "⚠️ Informational only. Consult a doctor.",
      doctors: doctors
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};