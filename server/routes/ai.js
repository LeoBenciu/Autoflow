require('dotenv').config();
const express = require('express');
const aiRouter = express.Router();
const {body, param, validationResult} = require('express-validator');
const isAuthenticated = require('../auth');
const fs = require('fs');
const axios = require('axios');

const evaluatePriceValidation = [
    body('year').isInt({min: 1800, max: 2025}).withMessage('Year must be between 1800 and 2025')
    .notEmpty().withMessage('Year must not be empty'),

    body('brand').isString().notEmpty().withMessage('Brand must not be empty'),

    body('model').isString().notEmpty().withMessage('Model must not be empty'),

    body('mileage').optional().isFloat({min: 0}).withMessage('Mileage must be a positive number'),

    body('fuel').isString().isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG']).withMessage('Invalid fuel type'),

    body('traction').optional().isString().isIn(['RWD', 'FWD', 'AWD', '4WD']).withMessage('Invalid traction type'),

    body('engine_size').optional().isFloat({ min: 0 }).withMessage('Engine size must be a positive number'),

    body('engine_power').optional().isInt({ min: 0 }).withMessage('Engine power must be a positive integer'),

    body('transmission').optional().isString().isIn(['Automatic', 'Manual']).withMessage('Invalid transmission'),

    body('body').optional().isString().withMessage('Invalid body'),
    
];

aiRouter.post('/evaluate-price', isAuthenticated,evaluatePriceValidation,async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          if (req.files) {
            req.files.forEach((file) => {
              fs.unlinkSync(file.path);
            });
          }
          return res.status(400).json({ errors: errors.array() });
        }
        const carDetails = req.body;

        const systemPrompt = 'You are an AI assistant specialized in automotive market analysis. Your task is to receive car details in JSON format and respond with a JSON containing four price points for that specific car based on the market price :very_good_price, good_price, average_price, and bad_price. Ensure that the output is a valid JSON object with the following keys: very_good_price, good_price, average_price, and bad_price. Do not include any additional text or explanations.'

        const userPrompt = `Input JSON:
        ${JSON.stringify(carDetails, null, 2)}
        
        Provide the output JSON with the four price points.`;
        try{
            const openAiResponse = await axios.post('https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini',
                    messages: [
                        {role: 'system', content: systemPrompt},
                       {role:'user', content:userPrompt},
                    ],
                    max_completion_tokens:100,
                    temperature:0.2,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY_PRICE}`
                    },
                }
            );

            const aiMessage = openAiResponse.data.choices[0].message.content.trim();

            let outputJSON;
            try {
              outputJSON = JSON.parse(aiMessage);
            } catch (parseError) {
              return res.status(500).json({
                error: 'Failed to parse AI response into JSON.',
              });
            }
        
            const outputFields = [
              'very_good_price',
              'good_price',
              'average_price',
              'bad_price',
            ];
        
            const missingOutputFields = outputFields.filter(
              (field) => !outputJSON.hasOwnProperty(field)
            );
        
            if (missingOutputFields.length > 0) {
              return res.status(500).json({
                error: `AI response is missing fields: ${missingOutputFields.join(
                  ', '
                )}`,
              });
            }
        
            res.json(outputJSON);
            
    }catch(err){
        console.error('Error communicating with OpenAi:', err.message);
        res.status(500).json({
            error: 'An error occurred while processing your request.'
        });
    }
    
});

aiRouter.post('/create-report', isAuthenticated,evaluatePriceValidation,async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
    return res.status(400).json({ errors: errors.array() });
  }
  const carDetails = req.body;

  const systemPrompt = 'You are an AI assistant specialized in automotive market analysis. Your task is to receive car details in JSON format and respond with a JSON containing the following details for that specific car: car_overview, known_issues, maintenance_tips. Ensure that the output is a valid JSON object with the following keys: car_overview, known_issues and maintenance_tips. Do not include any additional text or explanations.'

  const userPrompt = `Input JSON:
  ${JSON.stringify(carDetails, null, 2)}
  
  Provide the output JSON with the three reports about the car.`;
  try{
      const openAiResponse = await axios.post('https://api.openai.com/v1/chat/completions',
          {
              model: 'gpt-4o-mini',
              messages: [
                  {role: 'system', content: systemPrompt},
                 {role:'user', content:userPrompt},
              ],
              max_completion_tokens:500,
              temperature:0.2,
          },
          {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${process.env.OPENAI_API_KEY_PRICE}`
              },
          }
      );

      const aiMessage = openAiResponse.data.choices[0].message.content.trim();

      let outputJSON;
      try {
        outputJSON = JSON.parse(aiMessage);
      } catch (parseError) {
        return res.status(500).json({
          error: 'Failed to parse AI response into JSON.',
        });
      }
  
      const outputFields = [
        'car_overview',
        'known_issues',
        'maintenance_tips',
      ];
  
      const missingOutputFields = outputFields.filter(
        (field) => !outputJSON.hasOwnProperty(field)
      );
  
      if (missingOutputFields.length > 0) {
        return res.status(500).json({
          error: `AI response is missing fields: ${missingOutputFields.join(
            ', '
          )}`,
        });
      }
  
      res.json(outputJSON);
      
}catch(err){
  console.error('Error communicating with OpenAi:', err.message);
  res.status(500).json({
      error: 'An error occurred while processing your request.'
  });
}

});
  
module.exports = aiRouter;


