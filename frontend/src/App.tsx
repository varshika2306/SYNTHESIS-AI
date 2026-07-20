/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import {
  Shield,
  Search,
  Folder,
  Command,
  LogOut,
  Sparkles,
  Plus
} from 'lucide-react';


import { DockTab, Case } from './types';
import { mockCases } from './data/mockData';


import SplashAuth from './components/SplashAuth';
import BottomDock from './components/BottomDock';
import CommandPalette from './components/CommandPalette';
import AssistantOrb from './components/AssistantOrb';

import DNALab from './components/DNALab';
import FingerprintEngine from './components/FingerprintEngine';
import ConsensusGenome from './components/ConsensusGenome';

import ExplainabilityStudio from './components/ExplainabilityStudio';
import ResearchMode from './components/ResearchMode';
import AITimeMachine from './components/AITimeMachine';

import DigitalPassport from './components/DigitalPassport';
import AnalyticsHub from './components/AnalyticsHub';
import CanvasWorkspace from './components/CanvasWorkspace';

import ReportViewer from './components/ReportViewer';



export default function App() {


  const [isAuthenticated,setIsAuthenticated] =
    useState(false);


  const [analystName,setAnalystName] =
    useState('Analyst Varshika');


  const [organization,setOrganization] =
    useState('Global Digital Forensics Org');



  const [activeTab,setActiveTab] =
    useState<DockTab>('mission_control');



  const [isCommandPaletteOpen,setIsCommandPaletteOpen] =
    useState(false);



  const [cases,setCases] =
    useState<Case[]>(mockCases);



  const [activeCaseId,setActiveCaseId] =
    useState<string>(mockCases[0].id);



  // NEW: selected backend investigation
  const [selectedInvestigationId,setSelectedInvestigationId] =
    useState<number | null>(null);



  const [triggerNewInvestigation,setTriggerNewInvestigation] =
    useState(false);





  useEffect(()=>{


    const handleKeyDown =
      (e:KeyboardEvent)=>{


        if(
          (e.ctrlKey || e.metaKey)
          &&
          e.key==="k"
        ){

          e.preventDefault();

          setIsCommandPaletteOpen(
            prev=>!prev
          );

        }

      };



    window.addEventListener(
      "keydown",
      handleKeyDown
    );



    return ()=>{

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };


  },[]);





  const handleCommandPaletteSelect =
  (
    type:'tab'|'case'|'action',
    payload:string
  )=>{


    if(type==="tab"){

      setActiveTab(
        payload as DockTab
      );

    }


    else if(type==="case"){

      setActiveCaseId(payload);

      setActiveTab(
        "mission_control"
      );

    }


    else if(type==="action"){


      if(payload==="create_case"){

        setActiveTab(
          "mission_control"
        );

        setTriggerNewInvestigation(
          true
        );

      }

    }


  };





  const handleAssistantAction =
  (
    actionType:string
  )=>{


    if(actionType==="create_case"){

      setActiveTab(
        "mission_control"
      );

      setTriggerNewInvestigation(
        true
      );

    }


    else if(actionType==="compare_images"){

      setActiveTab(
        "explain_studio"
      );

    }


    else if(actionType==="generate_passport"){

      setActiveTab(
        "passport"
      );

    }


    else if(actionType==="research_mode"){

      setActiveTab(
        "research"
      );

    }


    else if(actionType==="search_evidence"){

      setActiveTab(
        "cases"
      );

    }


  };




  const activeCase =
    cases.find(
      c=>c.id===activeCaseId
    )
    ||
    cases[0]
    ||
    mockCases[0];




  const handleCreateCase =
  (
    newCase:Case
  )=>{


    setCases(
      prev=>[
        newCase,
        ...prev
      ]
    );


    setActiveCaseId(
      newCase.id
    );


  };





  if(!isAuthenticated){


    return (

      <SplashAuth

        onAuthSuccess={
          (name,org)=>{

            setAnalystName(name);

            setOrganization(org);

            setIsAuthenticated(true);

          }
        }

      />

    );


  }





  return (
    <div className="min-h-screen bg-[#050816] cyber-grid flex flex-col justify-between text-white selection:bg-blue-500/30 selection:text-white pb-32">
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-[50] glass-panel-heavy bg-[#0E1323]/80 border-b border-white/5 px-6 py-3.5 flex items-center justify-between">


        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={()=>setActiveTab('mission_control')}
        >

          <div className="w-9 h-9 rounded-xl bg-blue-600/25 border border-blue-500/30 flex items-center justify-center">

            <Shield className="w-5 h-5 text-blue-400"/>

          </div>


          <div>

            <h1 className="text-base font-display font-black tracking-widest text-white glow-text-blue">
              SYNTHESIS AI
            </h1>

            <p className="text-[9px] font-mono text-brand-accent tracking-widest uppercase">
              Digital DNA Platform
            </p>

          </div>


        </div>





        <div className="hidden md:flex items-center gap-4">


          <div className="flex items-center gap-2 bg-[#050816]/60 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-brand-muted">

            <Folder className="w-4 h-4 text-blue-400"/>

            <span>
              ACTIVE CASE:
            </span>


            <select
              value={activeCaseId}
              onChange={(e)=>setActiveCaseId(e.target.value)}
              className="bg-transparent text-white outline-none"
            >

              {cases.map(c=>(

                <option
                  key={c.id}
                  value={c.id}
                  className="bg-[#0E1323]"
                >
                  {c.name}
                </option>

              ))}


            </select>


          </div>





          <div
            onClick={()=>setIsCommandPaletteOpen(true)}
            className="flex items-center gap-3 w-64 bg-[#050816]/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-brand-muted cursor-pointer"
          >

            <Search className="w-4 h-4"/>

            <span>
              Quick Action Palette...
            </span>


            <Command className="w-3 h-3"/>


          </div>



        </div>





        <div className="flex items-center gap-3">


          <div className="hidden sm:block text-right">

            <h4 className="text-xs font-semibold">
              {analystName}
            </h4>


            <p className="text-[10px] text-cyan-400">
              {organization.substring(0,18)}...
            </p>


          </div>




          <button
            onClick={()=>setIsAuthenticated(false)}
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"
          >

            <LogOut className="w-4 h-4"/>

          </button>


        </div>


      </header>






      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8">


      <AnimatePresence mode="wait">


      <motion.div

        key={activeTab}

        initial={{
          opacity:0,
          y:10
        }}

        animate={{
          opacity:1,
          y:0
        }}

        exit={{
          opacity:0,
          y:-10
        }}

        className="w-full h-full"

      >





      {/* MISSION CONTROL */}

      {
      activeTab==="mission_control" &&

      <div className="space-y-6">


        <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-purple-950/40 border border-white/10 rounded-2xl p-6 flex justify-between items-center">


          <div>

            <div className="flex gap-2 text-cyan-400">

              <Sparkles className="w-4 h-4"/>

              <span className="text-xs font-mono">
                Forensic Command Node
              </span>

            </div>


            <h2 className="text-2xl font-bold mt-2">
              Start New Investigation
            </h2>


          </div>



          <button
            onClick={()=>setTriggerNewInvestigation(true)}
            className="bg-blue-600 px-5 py-3 rounded-xl flex gap-2"
          >

            <Plus className="w-4 h-4"/>

            New Investigation

          </button>


        </div>




        <CanvasWorkspace

          cases={cases}

          activeCaseId={activeCaseId}

          onSelectCase={setActiveCaseId}

          onCreateCase={handleCreateCase}

          onNavigateTab={setActiveTab}

          newInvestigationTriggered={triggerNewInvestigation}

          onResetNewInvestigationTrigger={
            ()=>setTriggerNewInvestigation(false)
          }

        />


      </div>

      }





      {/* DNA LAB */}

      {
      activeTab==="dna_lab" &&

      <div className="space-y-6">

        <DNALab activeCase={activeCase}/>

        <FingerprintEngine activeCase={activeCase}/>

      </div>

      }




      {/* EXPLAINABILITY */}

      {
      activeTab==="explain_studio" &&

      <div className="space-y-6">

        <ExplainabilityStudio activeCase={activeCase}/>

        <ConsensusGenome activeCase={activeCase}/>

      </div>

      }





      {/* RESEARCH */}

      {
      activeTab==="research" &&

      <div className="space-y-6">

        <ResearchMode/>

        <AITimeMachine activeCase={activeCase}/>

      </div>

      }





      {/* ANALYTICS */}

      {
      activeTab==="analytics" &&

      <AnalyticsHub/>

      }






      {/* REPORT VIEWER NEW */}

      {
      activeTab==="report_viewer" &&

      (
        selectedInvestigationId ?

        <ReportViewer
          investigationId={selectedInvestigationId}
        />

        :

        <div className="bg-[#0E1323]/80 border border-white/10 rounded-2xl p-6">

          <p className="text-brand-muted font-mono">
            Select an investigation to view report.
          </p>

        </div>

      )

      }





      {/* PASSPORT */}

      {
      activeTab==="passport" &&

      <DigitalPassport
        activeCase={activeCase}
      />

      }





      {/* CASES */}

      {
      activeTab==="cases" &&

      <div className="bg-[#0E1323]/80 border border-white/10 rounded-2xl p-6">


        <h3 className="text-xl font-bold">
          Forensic Investigation Archives
        </h3>



        <div className="grid md:grid-cols-3 gap-5 mt-6">


        {
        cases.map(c=>(

          <div
            key={c.id}
            className="border border-white/10 rounded-xl p-4"
          >

            <h4>
              {c.name}
            </h4>


            <button

              onClick={()=>{

                setActiveCaseId(c.id);

                setActiveTab('mission_control');

              }}

              className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"

            >
              Open Case

            </button>


          </div>


        ))

        }


        </div>


      </div>

      }





      {/* SETTINGS */}

      {
      activeTab==="settings" &&

      <div className="bg-[#0E1323]/80 border border-white/10 rounded-2xl p-6">

        <h3 className="text-xl font-bold">
          System Configuration
        </h3>

      </div>

      }





      </motion.div>

      </AnimatePresence>


      </main>





      <BottomDock

        activeTab={activeTab}

        onTabChange={setActiveTab}

        hasNoInvestigations={cases.length===0}

      />




      <AssistantOrb

        onTriggerAction={handleAssistantAction}

      />




      <CommandPalette

        isOpen={isCommandPaletteOpen}

        onClose={
          ()=>setIsCommandPaletteOpen(false)
        }

        onSelectAction={
          handleCommandPaletteSelect
        }

      />



    </div>

  );


}