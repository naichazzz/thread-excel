import store from '@/store';
import {setTablist} from '@/utils/auth'

export function chooseMenu(data,path) {
  return new Promise(function(resolve, reject){
   
    var key=data
    var tabList=store.state.tagsView.visitedViews
    console.log(tabList)
    if(tabList&&tabList.length>0){
   
      for(var i=0;i<tabList.length;i++){

        if(tabList[i].name==key){

          tabList[i].type=''
          for(var j=0;j<tabList.length;j++){
            if(tabList[j].name!=key){
              tabList[j].type='info'
            }
          }
          break;
        }
        else{
          if(i==tabList.length-1){
            var item
            if(path){
              item={name:key,type:'',path:path}
            }
            else{
              item={name:key,type:''}
            }
            tabList.push(item)
            for(var i=0;i<tabList.length-1;i++){
              tabList[i].type='info'
            }
          }
        }
      }
    }
    else{
      var item
      tabList=[]
      if(path){
        item={name:key,type:'',path:path}
      }
      else{
        item={name:key,type:''}
      }
      tabList.push(item)
    
    }
    store.dispatch('tagsView/addVisitedView', { tabList })
    sessionStorage.setItem('tabList',JSON.stringify(tabList))
    resolve(tabList);
  });

}
