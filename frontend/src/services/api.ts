const API_URL = import.meta.env.VITE_API_URL;


// =============================
// AUTH - REGISTER
// =============================

export async function register(
  username: string,
  email: string,
  password: string
) {

  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        email,
        password,
      }),
    }
  );


  if (!response.ok) {

    const error =
      await response.json()
      .catch(() => null);


    throw new Error(
      error?.detail ||
      "Registration failed"
    );

  }


  return await response.json();

}



// =============================
// AUTH - LOGIN
// IMPORTANT:
// Backend uses OAuth2PasswordRequestForm
// Requires x-www-form-urlencoded
// =============================

export async function login(
  email: string,
  password: string
) {


  const formData =
    new URLSearchParams();


  formData.append(
    "username",
    email
  );


  formData.append(
    "password",
    password
  );



  const response = await fetch(
    `${API_URL}/auth/login`,
    {

      method: "POST",

      headers: {

        "Content-Type":
        "application/x-www-form-urlencoded",

      },


      body:
      formData.toString(),

    }
  );



  if (!response.ok) {


    const error =
      await response.json()
      .catch(() => null);



    throw new Error(
      error?.detail ||
      "Login failed"
    );

  }



  const data =
    await response.json();



  localStorage.setItem(
    "token",
    data.access_token
  );



  return data;

}





// =============================
// TOKEN HELPER
// =============================

function getToken(){

  return localStorage.getItem(
    "token"
  );

}





// =============================
// UPLOAD INVESTIGATION
// =============================

export async function uploadInvestigation(
  image: File
) {


  const token =
    getToken();



  const formData =
    new FormData();



  formData.append(
    "image",
    image
  );



  const response =
    await fetch(

      `${API_URL}/api/v1/investigation/upload`,

      {

        method:"POST",

        headers:{

          Authorization:
          `Bearer ${token}`

        },

        body:formData

      }

    );



  if(!response.ok){


    const error =
      await response.json()
      .catch(()=>null);



    throw new Error(
      error?.detail ||
      "Image upload failed"
    );

  }



  const data =
    await response.json();



  /*
    Backend response:

    {
      message:"",
      investigation:{
        id,
        prediction,
        confidence,
        status,
        explanation_url
      }
    }

  */


  return (
    data.investigation ??
    data
  );

}





// =============================
// HISTORY
// =============================

export async function getHistory(){


  const token =
    getToken();



  const response =
    await fetch(

      `${API_URL}/api/v1/investigation/history`,

      {

        headers:{

          Authorization:
          `Bearer ${token}`

        }

      }

    );



  if(!response.ok){


    const error =
      await response.json()
      .catch(()=>null);



    throw new Error(
      error?.detail ||
      "History fetch failed"
    );


  }



  return await response.json();

}





// =============================
// SINGLE INVESTIGATION
// =============================

export async function getInvestigation(
  id:number
){


  const token =
    getToken();



  const response =
    await fetch(

      `${API_URL}/api/v1/investigation/${id}`,

      {

        headers:{

          Authorization:
          `Bearer ${token}`

        }

      }

    );



  if(!response.ok){


    const error =
      await response.json()
      .catch(()=>null);



    throw new Error(
      error?.detail ||
      "Investigation fetch failed"
    );


  }



  return await response.json();

}





// =============================
// REPORT GENERATION
// =============================

export async function getReport(
  id:number
){


  const token =
    getToken();



  const response =
    await fetch(

      `${API_URL}/api/v1/investigation/${id}/report`,

      {

        headers:{

          Authorization:
          `Bearer ${token}`

        }

      }

    );



  if(!response.ok){


    const error =
      await response.json()
      .catch(()=>null);



    throw new Error(
      error?.detail ||
      "Report generation failed"
    );


  }



  return await response.json();

}


export async function downloadReportPDF(id:number){

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/v1/investigation/${id}/pdf`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if(!response.ok){
    const txt = await response.text();
    throw new Error(txt || 'Failed to download PDF');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `investigation_${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}





// =============================
// DELETE INVESTIGATION
// =============================

export async function deleteInvestigation(
  id:number
){


  const token =
    getToken();



  const response =
    await fetch(

      `${API_URL}/api/v1/investigation/${id}`,

      {

        method:"DELETE",

        headers:{

          Authorization:
          `Bearer ${token}`

        }

      }

    );



  if(!response.ok){


    const error =
      await response.json()
      .catch(()=>null);



    throw new Error(
      error?.detail ||
      "Delete failed"
    );


  }



  return await response.json();

}