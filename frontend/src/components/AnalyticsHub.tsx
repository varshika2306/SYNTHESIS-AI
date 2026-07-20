/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from 'recharts';

import {
  BarChart2,
  ShieldAlert,
  Cpu,
  Activity,
  RefreshCw
} from 'lucide-react';

import { mockAnalytics } from '../data/mockData';
import { getHistory } from '../services/api';


export default function AnalyticsHub() {

  const [filterPeriod, setFilterPeriod] = useState<'7d' | '30d'>('7d');


  const [analyticsStats, setAnalyticsStats] = useState({
    totalScans: 0,
    synthetic: 0,
    alerts: 0,
    threatLevel: "LOW"
  });


  const [loading, setLoading] = useState(true);



  useEffect(() => {

    async function loadAnalytics(){

      try {

        const history = await getHistory();


        const totalScans = history.length;


        const synthetic = history.filter(
          (item:any)=> item.prediction === "FAKE"
        ).length;


        const real = history.filter(
          (item:any)=> item.prediction === "REAL"
        ).length;



        const threatLevel =
          synthetic > real
            ? "HIGH"
            : "LOW";



        setAnalyticsStats({

          totalScans,

          synthetic,

          alerts: synthetic,

          threatLevel

        });


      }
      catch(error){

        console.error(
          "Analytics loading failed:",
          error
        );

      }
      finally{

        setLoading(false);

      }

    }


    loadAnalytics();


  }, []);




  return (
    <div className="space-y-6">


      {/* Overview Stats cards */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


        <div className="bg-[#0E1323]/80 border border-white/10 p-4 rounded-xl glass-panel relative overflow-hidden">

          <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block mb-0.5">
            Total DNA Scans
          </span>


          <span className="text-2xl font-mono font-bold text-white">

            {loading
              ? "..."
              : analyticsStats.totalScans}

          </span>


          <p className="text-[9px] text-green-400 font-mono mt-1">
            Live forensic registry count
          </p>


        </div>



        <div className="bg-[#0E1323]/80 border border-white/10 p-4 rounded-xl glass-panel relative overflow-hidden">

          <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block mb-0.5">
            Synthetic Detections
          </span>


          <span className="text-2xl font-mono font-bold text-red-400">

            {loading
              ? "..."
              : analyticsStats.synthetic}

          </span>


          <p className="text-[9px] text-red-400 font-mono mt-1">

            AI generated media detected

          </p>


        </div>




        <div className="bg-[#0E1323]/80 border border-white/10 p-4 rounded-xl glass-panel relative overflow-hidden">

          <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block mb-0.5">
            Active Threat Alerts
          </span>


          <span className="text-2xl font-mono font-bold text-yellow-500">

            {loading
              ? "..."
              : analyticsStats.alerts}

          </span>


          <p className="text-[9px] text-brand-muted font-mono mt-1">

            Registry anomaly monitoring

          </p>


        </div>





        <div className="bg-[#0E1323]/80 border border-white/10 p-4 rounded-xl glass-panel relative overflow-hidden">


          <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block mb-0.5">

            System Threat Level

          </span>



          <span className={`text-2xl font-mono font-bold ${
            analyticsStats.threatLevel==="HIGH"
            ? "text-red-400"
            : "text-cyan-400"
          }`}>

            {loading
              ? "..."
              : analyticsStats.threatLevel}

          </span>



          <p className="text-[9px] text-cyan-400 font-mono mt-1">

            Real-time AI risk assessment

          </p>


        </div>



      </div>
            {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Chart A: Daily investigations */}
        <div className="lg:col-span-8 bg-[#0E1323]/85 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col justify-between">

          <div>

            <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">

              <div>

                <h3 className="text-sm font-mono font-bold tracking-widest text-brand-accent uppercase">
                  Daily Forensic Investigations
                </h3>

                <p className="text-[11px] text-brand-muted">
                  Distribution of synthetic vs authentic media uploads over the current week
                </p>

              </div>


              <div className="flex gap-1 bg-[#050816] border border-white/5 p-1 rounded-lg">

                <button
                  onClick={() => setFilterPeriod('7d')}
                  className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer ${
                    filterPeriod === '7d'
                      ? 'bg-blue-600/20 text-white border border-blue-500/30'
                      : 'text-brand-muted'
                  }`}
                >
                  7D
                </button>


                <button
                  onClick={() => setFilterPeriod('30d')}
                  className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer ${
                    filterPeriod === '30d'
                      ? 'bg-blue-600/20 text-white border border-blue-500/30'
                      : 'text-brand-muted'
                  }`}
                >
                  30D
                </button>


              </div>

            </div>



            <div className="w-full h-[280px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart
                  data={mockAnalytics.dailyInvestigations}
                  margin={{
                    top:10,
                    right:10,
                    bottom:0,
                    left:-25
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.02)"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={9}
                  />

                  <YAxis
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={9}
                  />


                  <Tooltip
                    contentStyle={{
                      backgroundColor:'#0E1323',
                      borderColor:'rgba(255,255,255,0.08)',
                      borderRadius:'8px'
                    }}
                  />


                  <Legend
                    wrapperStyle={{
                      fontSize:'10px',
                      paddingTop:'10px'
                    }}
                  />


                  <Bar
                    dataKey="synthetic"
                    fill="#ef4444"
                    radius={[4,4,0,0]}
                    name="Synthetic Anomalies"
                  />


                  <Bar
                    dataKey="real"
                    fill="#10b981"
                    radius={[4,4,0,0]}
                    name="Authentic Capture"
                  />


                </BarChart>

              </ResponsiveContainer>

            </div>


          </div>


          <div className="text-[10px] font-mono text-brand-muted text-center pt-3 border-t border-white/5 mt-4">

            Validation database synchronized dynamically with forensic registry block 908B.

          </div>


        </div>





        {/* Chart B: Generator distribution */}

        <div className="lg:col-span-4 bg-[#0E1323]/85 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col justify-between">


          <div>

            <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">


              <div>

                <h3 className="text-sm font-mono font-bold tracking-widest text-brand-accent uppercase">

                  AI Generator Trends

                </h3>


                <p className="text-[11px] text-brand-muted">

                  Distribution ratio of target generators

                </p>

              </div>


              <Cpu className="w-4 h-4 text-brand-muted"/>


            </div>



            <div className="w-full h-[240px]">


              <ResponsiveContainer width="100%" height="100%">


                <BarChart
                  data={mockAnalytics.generatorTrends}
                  layout="vertical"
                  margin={{
                    top:10,
                    right:10,
                    bottom:0,
                    left:10
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.02)"
                  />

                  <XAxis
                    type="number"
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={9}
                  />

                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={9}
                    width={90}
                  />


                  <Tooltip
                    contentStyle={{
                      backgroundColor:'#0E1323',
                      borderColor:'rgba(255,255,255,0.08)',
                      borderRadius:'8px'
                    }}
                  />


                  <Bar
                    dataKey="percentage"
                    fill="#2563eb"
                    radius={[0,4,4,0]}
                    name="Occurrence Ratio %"
                  />


                </BarChart>


              </ResponsiveContainer>


            </div>


          </div>



          <p className="text-[10px] font-mono text-brand-muted leading-relaxed mt-4 pt-4 border-t border-white/5 text-center">

            Attribution indices compiled over 40,000 deep image specimens.

          </p>


        </div>


      </div>
    </div>
  );
}
