/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import {
  useEffect,
  useState
} from "react";


import {
  ShieldAlert,
  FileSearch,
  Cpu,
  Download
} from "lucide-react";


import {
  getReport,
  downloadReportPDF
} from "../services/api";


interface ReportViewerProps {

  investigationId:number;

}


export default function ReportViewer(
{
 investigationId
}:ReportViewerProps
){


const [report,setReport]
=
useState<any>(null);



const [loading,setLoading]
=
useState(true);




useEffect(()=>{


async function loadReport(){


try{


const data =
await getReport(
 investigationId
);



setReport(data);



}
catch(error){


console.error(
 "Report loading failed",
 error
);


}
finally{


setLoading(false);


}


}



loadReport();



},[investigationId]);






if(loading){


return(

<div className="flex justify-center items-center h-64">


<p className="font-mono text-cyan-400 animate-pulse">

ANALYZING FORENSIC REPORT...

</p>


</div>

);


}






if(!report){


return(

<div className="text-red-400 font-mono">

REPORT UNAVAILABLE

</div>

);


}






const isFake =
    report.prediction === "FAKE" || report.prediction === "SYNTHETIC";




return(

<div className="space-y-6">





{/* HEADER */}

<div className="bg-[#0E1323]/85 border border-white/10 rounded-2xl p-6">


<div className="flex justify-between items-center">


<div>


<h2 className="text-xl font-mono font-bold text-white">

Investigation Report

</h2>


<p className="text-xs text-brand-muted mt-2">

AI FORENSIC ANALYSIS RESULT

</p>


</div>


<FileSearch className="text-cyan-400"/>


</div>


</div>






{/* RESULT */}


<div className="grid md:grid-cols-2 gap-6">



<div className="bg-[#0E1323]/85 border border-white/10 rounded-2xl p-6">


<p className="text-xs text-brand-muted font-mono">

CLASSIFICATION

</p>



<h1
className={`text-5xl font-mono font-bold mt-3 ${
isFake
?
"text-red-400"
:
"text-green-400"
}`}
>


{report.prediction}


</h1>




<p className="mt-4 text-cyan-400 font-mono">


Confidence:

{" "}

{report.confidence}%


</p>



</div>







<div className="bg-[#0E1323]/85 border border-white/10 rounded-2xl p-6">


<div className="flex items-center gap-3">


<ShieldAlert className="text-yellow-400"/>


<p className="font-mono text-white">

Threat Assessment

</p>


</div>



<p className="text-3xl font-mono text-yellow-400 mt-5">

{report.risk_level}


</p>


</div>



</div>








{/* SUMMARY */}

<div className="bg-[#0E1323]/85 border border-white/10 rounded-2xl p-6">


<div className="flex gap-3 items-center mb-4">


<Cpu className="text-blue-400"/>


<h3 className="text-white font-mono">

AI Evidence Analysis

</h3>


</div>



<p className="text-sm text-brand-muted font-mono">

{report.summary}

</p>



<ul className="mt-5 space-y-2 text-sm text-brand-muted font-mono">


{
report.findings?.map(
(item:string,index:number)=>(

<li key={index}>

✓ {item}

</li>

)

)

}


</ul>


</div>







<button

className="
flex items-center gap-2
bg-blue-600/20
border border-blue-500/40
px-5 py-3
rounded-xl
text-blue-300
font-mono
hover:bg-blue-600/30
"

>


<Download size={16}/>


Export Report PDF


</button>





</div>


);



}