/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

import {
  LayoutGrid,
  Cpu,
  Sparkles,
  Database,
  BarChart2,
  Folder,
  FileText,
  FileCheck,
  Settings
} from 'lucide-react';

import { DockTab } from '../types';



interface BottomDockProps {

  activeTab: DockTab;

  onTabChange: (tab: DockTab)=>void;

  hasNoInvestigations?: boolean;

}




export default function BottomDock({

  activeTab,

  onTabChange,

  hasNoInvestigations

}:BottomDockProps){



  const dockItems = [

    {
      id:'mission_control' as DockTab,
      label:'Mission Control',
      icon:<LayoutGrid className="w-5 h-5"/>,
      color:'text-blue-400 bg-blue-500/10 border-blue-500/25'
    },


    {
      id:'dna_lab' as DockTab,
      label:'Digital DNA Lab',
      icon:<Cpu className="w-5 h-5"/>,
      color:'text-cyan-400 bg-cyan-500/10 border-cyan-500/25'
    },


    {
      id:'explain_studio' as DockTab,
      label:'Explainability Studio',
      icon:<Sparkles className="w-5 h-5"/>,
      color:'text-purple-400 bg-purple-500/10 border-purple-500/25'
    },


    {
      id:'research' as DockTab,
      label:'Research Mode',
      icon:<Database className="w-5 h-5"/>,
      color:'text-indigo-400 bg-indigo-500/10 border-indigo-500/25'
    },


    {
      id:'analytics' as DockTab,
      label:'Analytics',
      icon:<BarChart2 className="w-5 h-5"/>,
      color:'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
    },


    {
      id:'cases' as DockTab,
      label:'Cases',
      icon:<Folder className="w-5 h-5"/>,
      color:'text-amber-400 bg-amber-500/10 border-amber-500/25'
    },


    // NEW REPORT VIEWER
    {
      id:'report_viewer' as DockTab,
      label:'Report Viewer',
      icon:<FileText className="w-5 h-5"/>,
      color:'text-blue-400 bg-blue-500/10 border-blue-500/25'
    },


    {
      id:'passport' as DockTab,
      label:'Digital Passport',
      icon:<FileCheck className="w-5 h-5"/>,
      color:'text-rose-400 bg-rose-500/10 border-rose-500/25'
    },


    {
      id:'settings' as DockTab,
      label:'Settings',
      icon:<Settings className="w-5 h-5"/>,
      color:'text-slate-400 bg-slate-500/10 border-slate-500/25'
    }

  ];





  return (

    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[40] max-w-full px-4">


      <motion.div

        layout

        className="glass-panel px-4 py-2.5 rounded-2xl flex items-end gap-1.5 shadow-2xl relative"

        style={{

          background:'rgba(14,19,35,0.4)',

          borderColor:'rgba(255,255,255,0.08)',

          boxShadow:
          '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'

        }}

      >


      {
      dockItems.map((item)=>{


        const isActive =
          activeTab===item.id;



        return (

          <div
            key={item.id}
            className="relative group"
          >



            {/* Tooltip */}

            <div className="
              absolute bottom-full left-1/2
              -translate-x-1/2 mb-3
              bg-[#0E1323]
              text-white
              border border-white/10
              text-[10px]
              font-mono
              py-1
              px-2.5
              rounded-lg
              opacity-0
              group-hover:opacity-100
              pointer-events-none
              transition-all
              whitespace-nowrap
            ">

              {item.label}

            </div>





            <button

              id={`dock-tab-${item.id}`}

              onClick={()=>onTabChange(item.id)}

              className={`
                flex items-center justify-center
                p-3 rounded-xl
                transition-all cursor-pointer
                relative
                ${
                  isActive
                  ?
                  'scale-110 shadow-lg text-white'
                  :
                  'text-brand-muted hover:text-white hover:bg-white/5'
                }
              `}

            >




              {
              hasNoInvestigations &&
              item.id==='mission_control' &&

              <motion.div

                animate={{
                  scale:[1,1.15,1],
                  opacity:[0.6,1,0.6]
                }}

                transition={{
                  duration:2,
                  repeat:Infinity
                }}

                className="
                  absolute inset-0
                  rounded-xl
                  border-2
                  border-blue-500/80
                "

              />

              }




              {
              isActive &&

              <motion.div

                layoutId="activeDockIndicator"

                className={`
                  absolute inset-0
                  rounded-xl
                  border
                  ${item.color.split(' ')[2]}
                  ${item.color.split(' ')[1]}
                `}

              />

              }




              <div
                className={`
                  relative z-10
                  ${isActive ? item.color.split(' ')[0] : ''}
                `}
              >

                {item.icon}

              </div>



            </button>





            {
            isActive &&

            <div
              className="
                absolute -bottom-1.5
                left-1/2
                -translate-x-1/2
                w-1.5 h-1.5
                rounded-full
                bg-blue-400
              "
            />

            }



          </div>

        );


      })

      }



      </motion.div>


    </div>


  );


}