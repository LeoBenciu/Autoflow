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
/**
 * @swagger
 * /evaluate-price:
 *   post:
 *     summary: Evaluate Car Price Points
 *     description: Analyze car details and provide four price points based on the automotive market.
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *               - brand
 *               - model
 *               - mileage
 *               - fuel
 *               - traction
 *               - engine_size
 *               - engine_power
 *               - transmission
 *               - body
 *             properties:
 *               year:
 *                 type: integer
 *                 description: Manufacturing year of the car.
 *                 example: 2018
 *               brand:
 *                 type: string
 *                 description: Brand of the car.
 *                 example: "Toyota"
 *               model:
 *                 type: string
 *                 description: Model of the car.
 *                 example: "Camry"
 *               mileage:
 *                 type: number
 *                 description: Mileage of the car in miles or kilometers.
 *                 example: 15000
 *               fuel:
 *                 type: string
 *                 description: Fuel type of the car.
 *                 enum:
 *                   - Petrol
 *                   - Diesel
 *                   - Electric
 *                   - Hybrid
 *                   - LPG
 *                 example: "Petrol"
 *               traction:
 *                 type: string
 *                 description: Traction type of the car.
 *                 enum:
 *                   - RWD
 *                   - FWD
 *                   - AWD
 *                   - 4WD
 *                 example: "FWD"
 *               engine_size:
 *                 type: number
 *                 description: Engine size in liters.
 *                 example: 2.5
 *               engine_power:
 *                 type: integer
 *                 description: Engine power in horsepower (HP).
 *                 example: 203
 *               transmission:
 *                 type: string
 *                 description: Transmission type.
 *                 enum:
 *                   - Automatic
 *                   - Manual
 *                 example: "Automatic"
 *               body:
 *                 type: string
 *                 description: Body type of the car.
 *                 example: "Sedan"
 *     responses:
 *       200:
 *         description: Successfully evaluated car price points.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 very_good_price:
 *                   type: number
 *                   description: The very good price point for the car.
 *                   example: 22000
 *                 good_price:
 *                   type: number
 *                   description: The good price point for the car.
 *                   example: 20000
 *                 average_price:
 *                   type: number
 *                   description: The average price point for the car.
 *                   example: 18000
 *                 bad_price:
 *                   type: number
 *                   description: The bad price point for the car.
 *                   example: 16000
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: List of validation errors.
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         description: Error message.
 *                         example: "Year must be between 1800 and 2025"
 *                       param:
 *                         type: string
 *                         description: Parameter that caused the error.
 *                         example: "year"
 *                       location:
 *                         type: string
 *                         description: Location of the parameter (e.g., body, query).
 *                         example: "body"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message describing what went wrong.
 *                   example: "Unauthorized access. Please provide a valid token."
 *       500:
 *         description: Internal server error while evaluating car prices.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: General error message.
 *                   example: "An error occurred while processing your request."
 *                 details:
 *                   type: string
 *                   description: Additional details about the error (optional).
 *                   example: "Failed to parse AI response into JSON."
 */
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

/**
 * @swagger
 * /create-report:
 *   post:
 *     summary: Create a car analysis report
 *     description: Generate detailed reports about the car, including overview, known issues, and maintenance tips based on provided car details.
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReportRequest'
 *           example:
 *             year: 2018
 *             brand: "Toyota"
 *             model: "Camry"
 *             mileage: 15000
 *             fuel: "Petrol"
 *             traction: "FWD"
 *             engine_size: 2.5
 *             engine_power: 203
 *             transmission: "Automatic"
 *             body: "Sedan"
 *     responses:
 *       200:
 *         description: Successfully created a car analysis report.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateReportResponse'
 *             example:
 *               car_overview: "The 2018 Toyota Camry is a reliable and efficient sedan known for its comfortable interior and smooth ride."
 *               known_issues: "Some owners have reported issues with the infotainment system and occasional transmission glitches."
 *               maintenance_tips: "Regular oil changes every 5,000 miles, timely replacement of brake pads, and routine inspections of the transmission system are recommended."
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               errors:
 *                 - msg: "Brand must not be empty"
 *                   param: "brand"
 *                   location: "body"
 *                 - msg: "Fuel type is invalid"
 *                   param: "fuel"
 *                   location: "body"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       500:
 *         description: Internal server error during report creation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "An error occurred while processing your request."
 *               details: "AI response is missing required fields."
 * components:
 *   schemas:
 *     CreateReportRequest:
 *       type: object
 *       required:
 *         - year
 *         - brand
 *         - model
 *         - fuel
 *       properties:
 *         year:
 *           type: integer
 *           description: Manufacturing year of the car.
 *           example: 2018
 *         brand:
 *           type: string
 *           description: Brand of the car.
 *           example: "Toyota"
 *         model:
 *           type: string
 *           description: Model of the car.
 *           example: "Camry"
 *         mileage:
 *           type: number
 *           description: Mileage of the car.
 *           example: 15000
 *         fuel:
 *           type: string
 *           description: Fuel type of the car.
 *           enum:
 *             - Petrol
 *             - Diesel
 *             - Electric
 *             - Hybrid
 *             - LPG
 *           example: "Petrol"
 *         traction:
 *           type: string
 *           description: Traction type of the car.
 *           enum:
 *             - RWD
 *             - FWD
 *             - AWD
 *             - 4WD
 *           example: "FWD"
 *         engine_size:
 *           type: number
 *           description: Engine size in liters.
 *           example: 2.5
 *         engine_power:
 *           type: integer
 *           description: Engine power in HP.
 *           example: 203
 *         transmission:
 *           type: string
 *           description: Transmission type.
 *           enum:
 *             - Automatic
 *             - Manual
 *           example: "Automatic"
 *         body:
 *           type: string
 *           description: Body type of the car.
 *           example: "Sedan"
 *     CreateReportResponse:
 *       type: object
 *       properties:
 *         car_overview:
 *           type: string
 *           description: Overview of the car.
 *           example: "The 2018 Toyota Camry is a reliable and efficient sedan known for its comfortable interior and smooth ride."
 *         known_issues:
 *           type: string
 *           description: Known issues associated with the car.
 *           example: "Some owners have reported issues with the infotainment system and occasional transmission glitches."
 *         maintenance_tips:
 *           type: string
 *           description: Maintenance tips for the car.
 *           example: "Regular oil changes every 5,000 miles, timely replacement of brake pads, and routine inspections of the transmission system are recommended."
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong.
 *           example: "Unauthorized access. Please provide a valid token."
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 *           example: "AI response is missing required fields."
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 description: Error message.
 *                 example: "Brand must not be empty"
 *               param:
 *                 type: string
 *                 description: Parameter that caused the error.
 *                 example: "brand"
 *               location:
 *                 type: string
 *                 description: Location of the parameter (e.g., body, query).
 *                 example: "body"
 */
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

  const systemPrompt = 'You are an AI assistant specialized in automotive market analysis. Your task is to receive car details in JSON format and respond with a JSON containing the following details for that specific car as strings NOT as arrays: car_overview, known_issues, maintenance_tips. Ensure that the output is a valid JSON object with the following keys: car_overview, known_issues and maintenance_tips. Do not include any additional text or explanations.'

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


