<template>
<div class="page">
  <div class="header">
    <div class="l">
      <div class="line">
        <span class="text">区域选择:</span> <el-select 
           v-model="postData.province" placeholder="区域选择" @change="provinceChange" clearable>
          <el-option
            v-for="item in areaDate"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
        <div class=" fly">
         <el-button @click="dialogVisible=true">选择飞机</el-button>
        </div>
      </div>
      <div class="time line">
       <span class="text"> 时间选择:</span>
       <div>
         <el-radio-group v-model="postData.statistic_time" @change="timeChange">
          <el-radio-button label="-0">今天</el-radio-button>
          <el-radio-button label="-1">昨天</el-radio-button>
          <el-radio-button label="-7">最近7天</el-radio-button>
          <el-radio-button label="-30">最近30天</el-radio-button>
          <el-radio-button :label="getAll">全部</el-radio-button>
        </el-radio-group>
       </div>
       <div class="picker">
         <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy/MM/dd"
            @change="timePickerChange"
            >
          </el-date-picker>
       </div>

      </div>
    </div>
    <div class="r">
      <p @click="downExcel" class="r-p">Excel下载</p>
    </div>
  </div>
  <div class="sum">
    <div>
      <p>总计：</p>
    </div>
    <ul>
      <li>
        <p>作业面积</p>
        <p>{{summary.work_area}} 亩</p>
      </li>
      <li>
        <p>作业时长</p>
        <p>{{summary.fly_hour | hours}} 分钟</p>
      </li>
      <li>
        <p>飞行架次</p>
        <p>{{summary.fly_num}} 次</p>
      </li>
      <li>
        <p>飞机数量</p>
        <p>{{summary.aircraft_num}}</p>
      </li>
    </ul>
  </div>
  <el-table
    :data="list"
    class="table"
    border
    height='400'
    max-height='500'
    style="width: 100%">
    <el-table-column
      prop="work_team"
      label="作业团队"
      width="120">
    </el-table-column>
    <el-table-column
      prop="work_user"
      label="作业人"
      width="120">
    </el-table-column>
     <el-table-column
      prop="work_address"
      label="作业地址">
    </el-table-column>
    <el-table-column
      prop="work_at"
     
      label="作业开始时间">
    </el-table-column>
     <el-table-column
      prop="work_time"
      label="作业时长(分钟)"
      :formatter="formatter"
      width="120">
    </el-table-column>
    <el-table-column
      prop="work_area"
      label="作业面积(亩)"
      width="120">
    </el-table-column>
     <el-table-column
      prop="work_device"
      label="飞机名(飞机编号)">
    </el-table-column>
  </el-table>
  <div class="botton">
     <el-pagination
    layout="total, prev, pager, next, jumper"
    :total="page_info.total_records"
    :current-page='postData.page'
    @current-change='pageChange'
    >
  </el-pagination>
  </div>
  <el-dialog
  title="选择飞机"
  :visible.sync="dialogVisible"
  width="60%"
  height='400px'
  >
  <div class="dialog-table">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
  <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="device_sn" class="checkbox" @change="handleCheckedCitiesChange">
      <el-checkbox  class="item" v-for="list in aircraftList" :label="list.aircraft_sn" :key="list.aircraft_sn">{{list.aircraft_name}}</el-checkbox>
    </el-checkbox-group>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="transformSN">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>
<script>
import getNowFormatDate from "../unti/getTime";
import axios from "../unti/axios";
import { Request, baseUri } from "../unti/config";
import formatDuring from '../unti/getMinutes'
export default {
  data() {
    return {
      areaDate: [],
      time: "",
      dialogVisible: false,
      isIndeterminate: false,
      checkAll:false,
      device_sn:[],
     
      postData: {
        province: "",
        statistic_time: "-0",
        page: 1,
        device_sn: ''
      },
      summary: {
        work_area: "0",
        fly_hour: 0,
        fly_num: 0,
        aircraft_num: 0
      },
      list: [],
      page_info: {
        page: 0,
        page_size: 0,
        total_records: 0
      },
       aircraftListKey:[],
      aircraftList: []
    };
  },
  created() {
    this.getAddress();
    this.getpPlatform();
    this.getAircraft();
  },
  methods: {
    // 弹窗、
    handleCheckAllChange(val) {

      this.device_sn = val ? this.aircraftListKey : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      this.isIndeterminate=true
      if(value.length===0){
        this.isIndeterminate=false
      }
      if(value.length===this.aircraftListKey.length){
        this.isIndeterminate=true
      }
      this.postData.page=1
      
    },
    transformSN(){
      let sns = this.device_sn
      let str =sns.join('|')
      this.dialogVisible = false
      this.postData.device_sn=str
      

      this.getpPlatform()
    },
    // end
    downExcel() {
      let postData = this.postData;
      location.href = `${baseUri}${Request.exportExcel}?statistic_time=${postData.statistic_time}&province=${postData.province}&device_sn=${postData.device_sn}`;
    },
    timePickerChange() {
      let time = this.time;
      if(!(time instanceof Array)){
        this.postData.statistic_time = `-0`;
      }else{
        this.postData.statistic_time = `${time[0]}-${time[1]}`;
      }
      this.postData.page=1
      
      this.getpPlatform();
    },
    pageChange(e) {
      this.postData.page = e;
      this.getpPlatform();
    },
    formatter({ work_time }) {
      if (work_time) {
        return formatDuring(work_time)
      }
    },
    provinceChange() {
      this.postData.statistic_time = "-0";
      this.postData.page = 1;
      this.time = "";
      this.getpPlatform();
    },
    timeChange() {
      this.postData.page = 1;
      this.time = "";
      this.getpPlatform();
    },




    getAddress() {
      axios(this, Request.getAddress, {}, "", res => {
        this.areaDate = res;
      });
    },



    upTop() {
      this.$nextTick(() => {
        let dom = document.querySelector(".el-table__body-wrapper");
        dom.scrollTop = 0;
      });
    },
    getpPlatform() {
      axios(this, Request.getPlatform, this.postData, "POST", res => {
        this.summary = res.summary;
        this.page_info = res.page_info;
        this.list = res.list;
        this.upTop();
      });
    },
    getAircraft() {
      axios(this, Request.getAircraft, {}, "", res => {
        this.aircraftList = res;
        let arr = []
        for(var i in res){
          arr.push(res[i].aircraft_sn)
        }
        this.aircraftListKey = arr
      });
    }
  },
  filters: {
    hours(e) {
      if (e) {
        return (e / 60).toFixed(3);
      } else {
        return 0;
      }
    }
  },
  computed: {
    getAll() {
      return "2017/01/01-" + getNowFormatDate("/");
    }
  }
};
</script>
<style>
.page {
  /* padding: 0 10px; */
  width: 98%;
  height: 100%;
  margin: 0 auto;
}
.checkbox {
  display: flex;
  flex-direction: column;
}
.el-dialog__body {
  height: 400px;
  overflow-y: scroll;
}
.item{
  margin: 0 !important;
}
.fly {
  margin-left: 20px;
}
.botton {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.header {
  height: 60px;
}
.sum {
  height: 80px;
  display: flex;
  border: 1px solid #e5e5e5;
}
.sum div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
}
.sum ul {
  display: flex;
  flex: 1;
  padding: 10px 0;
}
.sum ul li {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #e5e5e5;
  flex-direction: column;
}
.sum ul li p:nth-child(2) {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
.header {
  display: flex;
  align-items: center;
  padding: 30px 0;
}
.header .l {
  flex: 1;
  /* display: flex; */
}
.header .r {
  margin-right: 20px;
}
.time {
  display: flex;
}
.line {
  padding: 5px 5px;
  display: flex;
  align-items: center;
}
.line .text {
  margin-right: 10px;
}
.picker {
  margin-left: 20px;
}
.table {
  margin-top: 20px;
}
.r-p {
  cursor: pointer;
}
</style>
