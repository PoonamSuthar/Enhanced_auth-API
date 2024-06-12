#include<bits/stdc++.h>
using namespace std;

int main(){
    //timestamp,itemId
    vector<pair<int,int>> logs = //todo;


    sort(logs.begin(), logs.end());
    int currentTime = (logs[0]).first;
    int i = 0;
    int n = logs.size();
    unordered_map<int,int> priorities;
    unordered_map<int,int> accessedThisSecond;
    while (i < n){
        while (currentTime == (logs[i]).first){
            int itemId = (logs[i]).second;
            if (accessedThisSecond.find(itemId) != accessedThisSecond.end()){
                accessedThisSecond[itemId] += 1;
            }
            else {
                accessedThisSecond[itemId] = 1;
            }
            i++;
        }
        if (i < n){
            currentTime = logs[i].first;
            
        }
    }


    //map[time: vector<items>>]
    // map<int,vector<int>> mp;
    // map<int,int> priorities; //can be unordered
    // int n = logs.size();
    // for (int i=0;i<n;i++){
    //     int timestamp = (logs[i]).first;
    //     int itemId = (logs[i]).second;
    //     priorities[itemId] = 0;
    //     if (mp.find(timestamp) != mp.end()){
    //         (mp[timestamp]).push_back(itemId);
    //     }
    //     else {
    //         vector<int> temp = {itemId};
    //         mp[timestamp] = temp;
    //     }
    // }
    
    // vector<int> priorities(uniq_items.size(),0);
    // for (auto it = mp.begin(); it != mp.end(); it++){
       
        
    // }
}