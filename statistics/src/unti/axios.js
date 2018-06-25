
import {baseUri} from './config';
import axios from 'axios'
const maxios = (_this,uri,data,methods,callback) =>{
    uri=baseUri+uri
    const loading = _this.$loading({
        // lock: true,
        text: '加载中',
        // spinner: 'el-icon-loading',  
        // background: 'rgba(0, 0, 0, 0.4)'
      });
      let config = {
        timeout:30000
      }
    if(methods=='POST'){
       axios.post(uri,data,config).then((res)=>{
            callback(res.data.data)
            loading.close();

        }).catch((err)=>{
            loading.close();
        })

    }else{
        axios.get(uri,data,config).then((res)=>{
            callback(res.data.data)
            loading.close();
        }).catch((err)=>{
            loading.close();
        })
    }
   
 

}



export default maxios;