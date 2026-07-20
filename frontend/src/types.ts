/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


// ===============================
// APPLICATION NAVIGATION TABS
// ===============================

export type DockTab =

  | 'mission_control'

  | 'dna_lab'

  | 'explain_studio'

  | 'research'

  | 'analytics'

  | 'cases'

  | 'report_viewer'

  | 'passport'

  | 'settings';

export interface AssistantMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export interface FloatingWindow {
  id: string;
  type: DockTab;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  zIndex: number;
}






// ===============================
// FORENSIC CASE MODEL
// ===============================

export interface Case {


  id:string;


  name:string;


  description:string;


  investigator:string;



  priority:

  | 'LOW'

  | 'MEDIUM'

  | 'HIGH'

  | 'CRITICAL';




  status:

  | 'PENDING'

  | 'SCANNING'

  | 'COMPLETE';




  evidenceName:string;


  evidenceUrl:string;


  timestamp:string;





  // ===============================
  // REAL AI MODEL RESULT
  // ===============================


  prediction?:

  | 'REAL'

  | 'FAKE'

  | 'SYNTHETIC';



  confidence?:number;



  explanationUrl?:string;





  // ===============================
  // FORENSIC METRICS
  // ===============================


  authenticityScore:number;


  trustIndex:number;


  evidenceStrength:number;


  riskFactor:number;


  integrityIndex:number;


  consensusAgreement:number;






  // ===============================
  // DIGITAL DNA SCORES
  // ===============================


  dnaScores?:{


    texture:number;


    noise:number;


    lighting:number;


    edges:number;


    frequency:number;


    compression:number;


    diffusion:number;


    promptArtifacts:number;


  };







  // ===============================
  // IMAGE FINGERPRINTS
  // ===============================


  fingerprints?:{


    textureSignature:string;


    noiseSignature:string;


    reflectionSignature:string;


    frequencySignature:string;


    compressionSignature:string;


    promptArtifactSignature:string;


    lightingSignature:string;


    visualConsistency:number;


  };








  // ===============================
  // MODEL CONSENSUS
  // ===============================


  consensusModels?:{


    name:string;


    prediction:

    | 'REAL'

    | 'SYNTHETIC';



    confidence:number;


    agreement:boolean;


    inferenceTime:number;


    attentionMap:string;


  }[];







  // ===============================
  // AI GENERATOR ATTRIBUTION
  // ===============================


  genomeAttribution?:{


    stableDiffusion:number;


    midjourney:number;


    dalle:number;


    flux:number;


    firefly:number;


    ideogram:number;


    leonardo:number;


  };







  // ===============================
  // AI TIME MACHINE
  // ===============================


  timeMachineSteps?:{


    phase:string;



    status:

    | 'COMPLETED'

    | 'ACTIVE'

    | 'PENDING';




    description:string;


    timestamp:string;


    attributes:string[];


  }[];








  // ===============================
  // ANALYST DATA
  // ===============================


  analystNotes?:string;



  dnaHash?:string;



  fingerprintHash?:string;



}