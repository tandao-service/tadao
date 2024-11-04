"use server";
import axios from 'axios';
export async function sendSMS( phoneNumber:string, message:string,adTitle: string, adUrl:string) {
 
    //  const regueststatusurl = `https://ezeshamobile.co.ke/pit/stk_push_offerup.php?Account=${trackid}&Payphone=${payphone}&Amount=${amount}`;
       // Send SMS notification
       const smsMessage = `AutoYard: New inquiry on your ad "${adTitle}": ${message}`;
       const smsUrl = `http://107.20.199.106/sms/1/text/query?username=Ezeshatrans&password=5050Martin.com&from=Ezesha&text=${encodeURIComponent(
         smsMessage
       )}&to=${phoneNumber}`;
 
      // Set headers for the second request
      const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
    
      try {
        const response = await axios.get(smsUrl, { headers: requestHeaders });
  
       const responseData = response.data;
      // console.log(responseData);
       return "success";
      
      } catch (error) {
        console.error('Error:', error);
        return "error";
        // Handle error appropriately
      }



}
