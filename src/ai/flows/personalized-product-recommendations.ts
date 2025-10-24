'use server';

/**
 * @fileOverview A flow to generate personalized product recommendations for a user.
 *
 * - personalizedProductRecommendations - A function that generates personalized product recommendations.
 * - PersonalizedProductRecommendationsInput - The input type for the personalizedProductRecommendations function.
 * - PersonalizedProductRecommendationsOutput - The return type for the personalizedProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedProductRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate recommendations for.'),
  browsingHistory: z.array(z.string()).optional().describe('The user\'s browsing history (product IDs).'),
  purchaseHistory: z.array(z.string()).optional().describe('The user\'s purchase history (product IDs).'),
  preferences: z.string().optional().describe('The user\'s stated preferences.'),
});
export type PersonalizedProductRecommendationsInput = z.infer<typeof PersonalizedProductRecommendationsInputSchema>;

const PersonalizedProductRecommendationsOutputSchema = z.object({
  productRecommendations: z.array(z.string()).describe('A list of product IDs that are recommended for the user.'),
});
export type PersonalizedProductRecommendationsOutput = z.infer<typeof PersonalizedProductRecommendationsOutputSchema>;

export async function personalizedProductRecommendations(input: PersonalizedProductRecommendationsInput): Promise<PersonalizedProductRecommendationsOutput> {
  return personalizedProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedProductRecommendationsPrompt',
  input: {schema: PersonalizedProductRecommendationsInputSchema},
  output: {schema: PersonalizedProductRecommendationsOutputSchema},
  prompt: `You are an expert product recommendation system for BBS Entertainment, an e-commerce site specializing in audiovisual, multimedia, and entertainment products.

  Based on the user's provided information, generate a list of product IDs that they might be interested in.
  The product recommendations should be tailored to their browsing history, purchase history, and stated preferences.

  User ID: {{{userId}}}
  Browsing History: {{#if browsingHistory}}{{{browsingHistory}}}{{else}}None{{/if}}
  Purchase History: {{#if purchaseHistory}}{{{purchaseHistory}}}{{else}}None{{/if}}
  Preferences: {{#if preferences}}{{{preferences}}}{{else}}None{{/if}}

  Product Recommendations:`, // Ensure the prompt ends with the expected output
});

const personalizedProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedProductRecommendationsFlow',
    inputSchema: PersonalizedProductRecommendationsInputSchema,
    outputSchema: PersonalizedProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
