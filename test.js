const bacnet = require('bacstack');
// // const client = new bacnet({ interface: "192.168.1.66" });
const client = new bacnet({port : 47808});


 setInterval(() => {
     client.readProperty('172.29.32.133', null, { type: 2, instance: 8 }, 85, (err, data) => {
         if (err) {
             console.log('error COV: ', err);
             return;
         }

         console.log('readProperty : ',data);

     });
 }, 15000);


/*
 client.subscribeCOV('172.29.32.133', { type: 2, instance: 8 }, 1, false, false, 0, (err, data) => {
     if (err) {
         console.log('error COV: ', err);
         return;
     }
 });

// // client.subscribeProperty('192.168.1.144', {type: 0, instance: 9015},{id:85, index:4294967295}, 1, false, false, (err) => {
// //     console.log('error COV: ', err);
// // });


 client.on('covNotifyUnconfirmed', (data) => {
   if(data.request.monitoredObjectId.instance == 8 ){
     console.log('Received COV');
      console.log(data);
      console.log(data.request.values[0])
//      console.log(client._events["covNotifyUnconfirmed"].length)
}
 });

*/


/*
setInterval(() => {
       let value = Math.floor(Math.random() * 50);
console.log(value)
       client.writeProperty('172.29.32.133', null, { type: 2, instance: 7 }, 85, [{ type: 4, value: value }], { priority: 8 }, (err, value) => {
            if (err) {
               console.log('error pilotage: ', err);
               return;
            }

      console.log("pilotage success")
         })},30000)
*/
