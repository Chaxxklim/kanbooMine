import axios from 'axios';
import jsPDF from "jspdf";
// import jsPDF from 'jspdf/dist/jspdf.node.debug'

import autoTable from "jspdf-autotable";
import malgun from "@/assets/malgunBase64.js"
// import malgun2 from "https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap";
const demand = {
    namespaced: true,
    state: {
        projectName : "Test_Project",
        modifiedDate : "2021-01-01 11:00",
        checkedArr : [],
        checkedAll : false,
        storeDemandIdx : "1", // 이거 받아오는 로직 마들기
        sideBar : "false",

        columns : [
            {
              name : "chk",
              prop : "chk",
              size : 35
            },
            {
                name : "No",
                prop : "no",
                size : 50
            },
            {
                name : "카테고리",
                prop : "category",
                size : 130
            },
            {
                name : "요구사항 ID",
                prop : "demandId",
                size : 150
            },
            {
                name : "요구사항 명",
                prop : "demandName",
                size : 200
            },
            {
                name : "요구사항 상세 설명",
                prop : "demandDetail",
                size: 700
            },
            {
                name : "요청자(요청부서)",
                prop : "requester",
                size : 300
            },
            {
                name : "비고",
                prop : "remark",
            }

        ],
        rows : [

        ],
    },
    mutations: {

        addRow(state) {
            let sessionIdx = sessionStorage.getItem("project")
            state.rows.push({

                chk : "",
                demand: {
                    demandIdx : sessionIdx, // 스토어에서 디맨드idx받아오는거 만들기
                    project : {
                        prjctIdx : "",
                        prjctNm : ""
                    }
                },
                // demandCnIdx : state.rows[state.rows.length].demandCnIdx,
                demandCnIdx : "",
                demandCnNum : "",
                demandCnSe : "",
                demandCnId : "",
                demandCnNm : "",
                demandCnDetail : "",
                demandCnRequstNm : "",
                demandCnRm : "",

            })
            // sessionStorage.getItem("memTag")

            const arr = [];
            for(let item of state.rows) {
                arr.push({...item});
            }
            axios.post('/demand/postRows', {
                params : arr
            }).then((res) => {

                state.rows = [];
                for (const resKey in res.data) {
                    state.rows.push(res.data[resKey])
                }
                console.log(state.rows);
            }).catch( () => {
            })
        },

        save(state){
            const arr = [];
            for(let item of state.rows) {
                arr.push({...item});
            }
            axios.post('/demand/postRows', {
                params: arr
            }).then(() => {
                console.log("잘됨ㅋㅋ");
            }).catch( () => {
            })
        },
        load(state){
            let sessionIdx = sessionStorage.getItem("project");
            axios.post('/demand/load',  {
                idx : sessionIdx
            }).then(res => {
                for (const resKey in res.data) {
                    state.rows.push(res.data[resKey])
                }
                console.log(state.rows)
            }).catch(() =>{
                console.log("요구사항 정의서 상세정보를 불러오는데 실패했습니다.");
                console.log(state.sideBar)
            });

        },
        uploadFile(state){
            let sessionIdx = sessionStorage.getItem("project")
            if(confirm("업로드 시 기존 요구사항 내용이 삭제됩니다. 진행하시겠습니까?") === true){
                console.log("uploadFIle")
                const frm = new FormData();
                let uploadFile = document.getElementById("uploadFile");

                frm.append("uploadFile", uploadFile.files[0]);
                frm.append('demandIdx', sessionIdx);
                axios.post('/demand/importDocument', frm, {
                    headers : {
                        'Content-Type' : 'multipart/form-data'
                    }
                }).then(() =>{
                    axios.post('/demand/load', {
                        idx : sessionIdx // 나중에 여기에 스토어에서 프로젝트 데이터 빼오자
                    }).then(res => {
                        state.rows = [];
                        for (const resKey in res.data) {
                            state.rows.push(res.data[resKey])
                        }
                        console.log(state.rows)
                    }).catch(() =>{
                        console.log("요구사항 정의서 상세정보를 불러오는데 실패했습니다.");
                    });
                })
            } else{
                alert("취소되었습니다.")
            }
        },
        down(state, event){
            let input = event.target.value;
            if(input === "Excel") {
                axios({
                    url: '/demand/downDocument', //your url
                    method: 'POST',
                    responseType: 'blob',
                    data: {
                        "idx" : state.rows[0].demand.demandIdx,
                        "prjctNm" : state.rows[0].demand.project.prjctNm
                    }// important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', state.projectName + ' demand.xlsx'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
            } else if(input === "PDF"){
                console.log("여기 수정")
                const doc = new jsPDF('l', 'mm', 'a4');
                const font = malgun.malgun;
                // const font2 = malgun2;
                doc.addFileToVFS('malgun.ttf', font);
                // doc.addFileToVFS('malgun2.ttf', font2);
                doc.addFont('malgun.ttf', 'malgun', 'normal');
                // doc.addFont('malgun2.ttf', 'malgun2', 'normal');
                doc.setFont('malgun');
                // doc.setFont('malgun2');
                console.log(doc.getFontList());
                const data = [];
                for(let i = 0; i < state.rows.length; i++){
                    const obj = [];
                    obj[i] = [
                        state.rows[i].demandCnNum,
                        state.rows[i].demandCnSe,
                        state.rows[i].demandCnId,
                        state.rows[i].demandCnNm,
                        state.rows[i].demandCnDetail,
                        state.rows[i].demandCnRequstNm,
                        state.rows[i].demandCnRm
                    ]
                    data.push(obj[i])
                }
                console.log(data)
                autoTable(doc,{
                    // styles : { font : "malgun", fontStyle : "normal"},
                    styles : { font : "malgun", fontStyle : "normal"},
                    head : [['No', 'Category', 'Demand ID', 'Demand Name', 'Demand Description',
                        'Requester', 'Remark']],
                    body : data,
                })
                doc.save('test.pdf');
            }

            const sel = document.querySelector('#export-select');
            sel.value = 'none'

        },
        clickAllCheckBox(state){
            let headCheckBox = document.querySelector('.headCheckBox');
            let allCheckBox = document.querySelectorAll('.demand-table-chk');
            console.log(headCheckBox.checked)
            if(headCheckBox.checked === false) {
                for(let i = 0; i < allCheckBox.length; i++){
                    allCheckBox[i].checked = false;
                    state.checkedAll = false;
                }
                state.checkedArr = [];
            }else {
                for(let i = 0; i < allCheckBox.length; i++){
                    allCheckBox[i].checked = true;
                    state.checkedAll = true;
                }
                for(let i = 0; i< state.rows.length; i++){
                    const temp = {demandCnIdx : state.rows[i].demandCnIdx,
                        demand : {
                            demandIdx: state.rows[0].demand.demandIdx
                        }
                    }
                    state.checkedArr.push(temp)
                }
            }
        },
        clickCheckBox(state, item){
            if(state.checkedArr.includes(item)){
                let delPoint = state.checkedArr.indexOf(item);
                state.checkedArr.splice(delPoint, 1);
            }else{
                const temp = {demandCnIdx : item,
                    demand : {
                        demandIdx: state.rows[0].demand.demandIdx
                    }
                }
                state.checkedArr.push(temp);
            }
        },
        deleteRow(state){
            let sessionIdx = sessionStorage.getItem("project")
            if(confirm("삭제하시겠습니까?") === true){
                if(state.checkedArr == null){
                    console.log("null checkedArr")
                }
                const arr = []
                for(let item of state.checkedArr) {
                    arr.push({...item});
                }
                console.log(arr)
                axios.post('/demand/deleteRows', {
                    params: arr
                }).then(() => {
                    axios.post('/demand/load', {
                        idx : sessionIdx // 나중에 여기에 스토어에서 프로젝트 데이터 빼오자
                    }).then(res => {
                        state.rows.splice(0, state.rows.length);
                        for (const resKey in res.data) {
                            state.rows.push(res.data[resKey])
                        }
                        console.log(state.rows)
                    }).catch(() =>{
                        console.log("요구사항 정의서 상세정보를 불러오는데 실패했습니다.");
                    });
                }).catch(() => {
                })
            }else{
                alert("취소되었습니다.");
            }
        },

        getSideBar(state){
            state.sideBar = state.rows !== null;
        }


    },
    actions: {

    },
    getters: {

    },

}

export default demand