import axios from "axios";

const setting = {
  namespaced: true,
  state: {

    userInfo : "",
    clickState  : false,
    projectName : 'Test_Project',
    roleList : [// 여기에 ajax로 요청한 데이터 들어와야함.
      'PM','PL','DA','TA','AA','UA','BA','EA','SA'
    ],

    projectDate : {

    },

    projectData : {

    },

    userInputDate : {

      startDate : '',
      endDate : ''
    },


    roleMatch : {
      PM : false,
      PL : false,
      DA : false,
      TA : false,
      AA : false,
      UA : false,
      BA : false,
      EA : false,
      SA : false
    },

    searchMemberList : [

    ],

    selectMemberList : [

    ],

    projectMemberList : [ // 여기에 ajax로 요청한 데이터 들어와야함.

    ]


  },
  mutations: {
    changeClickState(state){
      if(state.clickState === false){
        state.clickState = true;
      } else{
        state.clickState = false;
      }
    },

    loadData(state){
      let idx = sessionStorage.getItem("project")
      axios.post('/setting/loadProjectMember', {
        prjctIdx : idx
      }).then(res => {
        for (const resKey in res.data) {
          state.projectMemberList.push(res.data[resKey]);
        }
        for (let i = 0; i < state.projectMemberList.length; i++) {
          const tempRoleData = {
            PM : false,
            PL : false,
            DA : false,
            TA : false,
            AA : false,
            UA : false,
            BA : false,
            EA : false,
            SA : false
          }
          state.projectMemberList[i].tempRoleData = tempRoleData

          const loadRole = state.projectMemberList[i].prjctMemRole.split(',');

          for (let j = 0; j < loadRole.length; j++) {
            if(loadRole[j] === 'PM'){
              state.projectMemberList[i].tempRoleData.PM = true;
            } else if(loadRole[j] === 'PL'){
              state.projectMemberList[i].tempRoleData.PL = true;
            }else if(loadRole[j] === 'DA'){
              state.projectMemberList[i].tempRoleData.DA = true;
            }else if(loadRole[j] === 'TA'){
              state.projectMemberList[i].tempRoleData.TA = true;
            }else if(loadRole[j] === 'AA'){
              state.projectMemberList[i].tempRoleData.AA = true;
            }else if(loadRole[j] === 'UA'){
              state.projectMemberList[i].tempRoleData.UA = true;
            }else if(loadRole[j] === 'BA'){
              state.projectMemberList[i].tempRoleData.BA = true;
            }else if(loadRole[j] === 'EA'){
              state.projectMemberList[i].tempRoleData.EA = true;
            } else{
              state.projectMemberList[i].tempRoleData.SA = true;
            }
          }
          state.projectMemberList[i].roleList = loadRole;
        }
        state.projectDate.startDate = state.projectMemberList[0].project.prjctStartDate;
        state.projectDate.endDate = state.projectMemberList[0].project.prjctEndDate;
        console.log(state.projectMemberList)
      })

      axios.post('/setting/loadProject', {
        prjctIdx : 1
      }).then(res => {
        // for (const resKey in res.data) {
        //   state.projectData.push(res.data[resKey]);
        // }
        state.projectData = res.data;
      })
    },




    isRoleMatch(state){
      alert("gogo!!")
      for(let i in state.projectMemberList){
        for(let j in state.projectMemberList[i].roleList){
          for(let k in state.roleList){
            if(state.projectMemberList[i].roleList[j] ===  state.roleList[k]){
              // this.$store.state.setting.projectMemberList[i].role.push(this.$store.state.setting.roleList[k]);
              document.getElementById(state.roleList[k] + '-span' + i).style.color = "red";
            }
          }
        }
      }
    },

    clickModifyBtn(state){
      state.clickState = true;
    },

    addBtn(state){
    console.log(state.selectMemberList)
      const arr = [];
      for(let item of state.selectMemberList) {
        if(item.tempRole == null){
          alert("정보를 제대로 입력해주세요.")
          break;
        }else{
          const obj = {
            member : item,
            project : state.projectData,
            prjctMemRole : item.tempRole
          };
          arr.push(obj);
        }
        axios.post('/setting/addProjectMember', {
          params: arr
        }).then(() => {
          console.log("잘됨ㅋㅋ");
        }).catch( () => {

        })
      }
    },

    getUserInfo(state){
      let projectIdx = sessionStorage.getItem("project")
      let userToken = sessionStorage.getItem("token");
      axios.post('/access/checkProjectMember', {
        token : userToken,
        projectIdx : projectIdx
      }).then(res =>{
        state.userInfo = res.data;
        console.log(res)
        console.log(userToken)
      })
    }




  },
  actions: {

  },

}

export default setting