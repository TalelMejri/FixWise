// import type { IssueAnalysisResult, Urgency } from '../types'

// // MockAiAssistantService — local dev / testing / demos.
// // Mirrors the shape of IAiAssistantService from the backend spec so that
// // swapping in AzureOpenAiAssistantService / OpenAiAssistantService later
// // requires no changes to callers.

// const CRITICAL_KEYWORDS = [
//   'gas smell', 'gas leak', 'burning smell', 'exposed wire', 'sparking',
//   'water near electrical', 'brake fail', 'steering fail', 'structural crack',
//   'smoke', 'fire',
// ]
// const HIGH_KEYWORDS = ['leak', 'won\'t start', 'overheating', 'grinding', 'shaking violently', 'no power', 'tripping breaker']
// const MEDIUM_KEYWORDS = ['noise', 'slow', 'squeak', 'vibration', 'stain', 'loose']

// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }

// function detectUrgency(text: string): Urgency {
//   const lower = text.toLowerCase()
//   if (CRITICAL_KEYWORDS.some((k) => lower.includes(k))) return 'Critical'
//   if (HIGH_KEYWORDS.some((k) => lower.includes(k))) return 'High'
//   if (MEDIUM_KEYWORDS.some((k) => lower.includes(k))) return 'Medium'
//   return 'Low'
// }

// export async function analyzeIssue(_assetName: string, description: string): Promise<IssueAnalysisResult> {
//   await delay(900)
//   const urgency = detectUrgency(description)
//   const requiresProfessional = urgency === 'High' || urgency === 'Critical'

//   const base: IssueAnalysisResult = {
//     category: 'General maintenance',
//     urgency,
//     possibleCauses: [
//       'Normal wear from regular use',
//       'A loose or worn component',
//       'Buildup of dirt, dust, or residue',
//     ],
//     safeChecks: [
//       'Visually inspect for obvious damage or loose parts',
//       'Check that the unit is clean and free of obstructions',
//       'Confirm the issue happens consistently, not just once',
//     ],
//     requiresProfessional,
//     suggestedLogTitle: `${description.slice(0, 40)}${description.length > 40 ? '…' : ''}`,
//     suggestedReminder: 'Follow-up check in 2 weeks',
//   }

//   if (urgency === 'Critical') {
//     return {
//       ...base,
//       category: 'Safety-critical issue',
//       possibleCauses: ['This may involve gas, electrical, or structural risk'],
//       safeChecks: ['Do not attempt to inspect or repair this yourself', 'Turn off the affected system at the source if it is safe to do so', 'Evacuate the area if you smell gas or see smoke'],
//       requiresProfessional: true,
//       safetyWarning: 'This looks like a safety-critical issue. Contact a certified professional immediately and avoid using the asset until it has been inspected.',
//     }
//   }

//   if (urgency === 'High') {
//     return {
//       ...base,
//       category: 'Needs prompt attention',
//       safetyWarning: 'Stop using the asset until this has been checked to avoid further damage.',
//     }
//   }

//   return base
// }

// export async function generateDiyPlan(goal: string, experienceLevel: string, budget: number) {
//   await delay(1100)
//   return {
//     title: goal,
//     durationEstimate: experienceLevel === 'Beginner' ? '1–2 weekends' : '1 weekend',
//     toolsRequired: ['Basic hand tool kit', 'Measuring tape', 'Safety glasses', 'Work gloves'],
//     materials: [
//       { name: 'Primary material (per project scope)', qty: '1–2 units', estCost: Math.round(budget * 0.5) },
//       { name: 'Fixings & adhesives', qty: 'assorted', estCost: Math.round(budget * 0.15) },
//       { name: 'Finishing supplies', qty: '1 set', estCost: Math.round(budget * 0.2) },
//     ],
//     steps: [
//       'Measure the space and confirm the plan fits your requirements',
//       'Gather all tools and materials before starting',
//       'Prepare the work area and protect surrounding surfaces',
//       'Complete the main task in stages, checking progress as you go',
//       'Clean up and do a final safety check',
//     ],
//     safetyNotes: [
//       'Wear appropriate protective equipment for the task',
//       'Never bypass electrical or gas safety systems yourself',
//       'Stop and consult a professional if the task becomes more complex than expected',
//     ],
//     budgetEstimate: Math.round(budget * 0.9),
//   }
// }

// export async function summarizeMaintenanceLog(rawNotes: string) {
//   await delay(700)
//   const wordCount = rawNotes.trim().split(/\s+/).filter(Boolean).length
//   return {
//     summary: wordCount > 0
//       ? `Summary: ${rawNotes.trim().slice(0, 120)}${rawNotes.length > 120 ? '…' : ''}`
//       : 'No notes provided.',
//     detectedActions: ['Inspection performed', 'Minor adjustment made'],
//     suggestedNextReminderTiming: 'In 3 months',
//   }
// }

// export async function generateRecommendations(assetNames: string[]) {
//   await delay(600)
//   return assetNames.slice(0, 3).map((name, i) => ({
//     id: `rec-${i}`,
//     title: `Check ${name} soon`,
//     explanation: `Based on its maintenance history, ${name} is due for a routine check to avoid bigger issues later.`,
//     urgency: (i === 0 ? 'Medium' : 'Low') as Urgency,
//   }))
// }
