import * as request from './utils/request';
import * as http from 'http';

const download=async (pageUrl:string)=>{
    const response = await request.get(pageUrl);
    console.log('---')
    if(response instanceof http.IncomingMessage){
        console.log(response.headers)
        response.on('data',buf=>{
            console.log(buf)
        })
    }
}

export{
    download
}