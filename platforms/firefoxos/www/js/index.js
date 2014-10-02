/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


app.initialize();

 // Wait for device API libraries to load
 //
document.addEventListener("deviceready", onDeviceReady, false);

 // device APIs are available
 //
function onDeviceReady() {
    //navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

/*
 // onSuccess Geolocation
 //
function onSuccess(position) {
    var element = document.getElementById('geolocation');
    var string = 'Latitude: ' + position.coords.latitude + '<br />' +
        'Longitude: ' + position.coords.longitude + '<br />';
    element.innerHTML = string;
    console.log(string);

    console.log('calling xhr');
    var request = XMLHttpRequest();
request.open("GET", 
    "http://open.mapquestapi.com/geocoding/v1/reverse?" + 
"key=Fmjtd|luur2hurn0%2Cbg%3Do5-9wasly&location=" +
position.coords.latitude + "," + position.coords.longitude, true);
request.onreadystatechange = function() {
    if (request.readyState == 4) {
        if (request.status == 200 || request.status == 0) {
            var city = JSON.parse(request.responseText);
            console.log(city.results[0].locations[0].adminArea5);

            var string = 'Latitude: ' + position.coords.latitude + '<br />' +
        'Longitude: ' + position.coords.longitude + '<br /> You are in: ' + city.results[0].locations[0].adminArea5;
            element.innerHTML = string;

        }
    }
};
request.send();
}

 // onError Callback receives a PositionError object
 //
function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}
*/


/*var checkConnection = function() {    

    var networkState = navigator.connection.type;
    var states = {};    
    states[Connection.UNKNOWN]  = 'Unknown connection';    
    states[Connection.ETHERNET] = 'Ethernet connection';    
    states[Connection.WIFI]     = 'WiFi connection';    
    states[Connection.CELL_2G]  = 'Cell 2G connection';     
    states[Connection.CELL_3G]  = 'Cell 3G connection';    
    states[Connection.CELL_4G]  = 'Cell 4G connection';    
    states[Connection.CELL]     = 'Cell generic connection';     
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]); 
}*/

document.addEventListener("offline", function() {  
    var element = document.getElementById('contacts');
    var string = "offline";

    contacts.innerHTML = string;
}, false);

document.addEventListener("online", function() {   
    var element = document.getElementById('network');
    var string = "online";
    //checkConnection();

    element.innerHTML = string;
    
    contactPull();
    
}, false);


function contactPull(){
    
    var request = new XMLHttpRequest();
	request.open("GET", "https://dl.dropboxusercontent.com/u/887989/MAD9135/contacts.json", true);
	request.onreadystatechange = function() {
	if (request.readyState === 4){
        
        //console.log("here");
        
        if (request.status === 200 || request.status === 0) {
            console.log("response: " + request.responseText);

            var rawData = JSON.parse(request.responseText);
            var contact;
            var name;

            for(var i = 0; i < request.response.length; i++){
                //console.log(rawData[i].firstname);

                contact = navigator.contacts.create();
                contact.displayName = rawData[i].firstname + " " + rawData[i].lastname;

                name = new ContactName();
                name.givenName = rawData[i].firstname;
                name.familyName = rawData[i].lastname;
                contact.name = name;
                
                
                var phoneNumbers = [];
                phoneNumbers[0] = new ContactField("mobile", rawData[i].phone, false);
                contact.phoneNumbers = phoneNumbers;
                
                var emails = [];
                emails[0] = new ContactField("email", rawData[i].email, false);
                contact.emails = emails;
                
                var addresses= [];
                var address = new ContactAddress();
                address.locality = rawData[i].city;
                address.streetAddress = rawData[i].street;
                address.type = "Home";
                address.region = rawData[i].state;
                
                addresses[0]= address;
               
                contact.addresses = addresses;
                
                /*
                {
                country; // country name corresponding to this ContactAddress.
                formatted; // the full physical address
                locality; //the locality (or city) name corresponding to this ContactAddress.
                postalCode of type DOMString, nullable
                pref; // primary address if true, By default, the value is false.
                region; // the region (or state/province) name corresponding to this ContactAddress.
                streetAddress; // the street address corresponding to this ContactAddress.
                type; // the type of address (e.g. work, home, premises, etc).
                };
                */
                    
                contact.save(saveSuccess(i),saveError);

                }

            }
    
        }
        else{
            console.log(request.readyState);
            console.log("connecting...");
        }
	};	
    
	request.send();
}



var clearButton = document.getElementById("clear");

clearButton.addEventListener("click", function() {  
    
    var options      = new ContactFindOptions();
    options.multiple = true;
    var fields       = ["*"];
    navigator.contacts.find(fields, findSuccess, findError, options);
    
}, false);

function findSuccess(contacts){
    //alert("Worked!");
    
    for (var i = 0; i < contacts.length; i++) {
        contacts[i].remove(removeSuccess, removeError);
    }
}

function findError(){
    console.log("find Didnt work");
}

function removeSuccess(){
    console.log("remove Worked!");
}

function removeError(){
    console.log("remove Didnt work");
}

function publishContacts(){
	console.log("derp");
	var options      = new ContactFindOptions();
    options.multiple = true;
    var fields       = ["*"];
    navigator.contacts.find(fields, displaySuccess, displayError, options);
}

function displaySuccess(contacts){
    
    console.log("displaying");
    
    var list = document.getElementById("contacts");
    //var option;
    
    list.innerHTML+= "<ul>";
    for(var i = 0; i < contacts.length; i++){
        list.innerHTML += "<li><a id = 'contact-"+i+"'><p>" + contacts[i].displayName + "</p></a></li>";
        
        
		}
    list.innerHTML+= "</ul>";
    
    for(var j=0; j<contacts.length; j++) {
        var contactItem = document.getElementById("contact-"+j);
        console.log(contactItem);
        contactItem.addEventListener("click", function(){console.log("IS IT WORKING YET!?");}, false);
    }
    
    console.log("displaying");
    
		
    }

function displayError(){
    console.log("display Didnt work");
}

function saveSuccess(i){ 
    if(i == 4){
        
        setTimeout(function(){publishContacts();}, 2000);
    }
}

function saveError(){
    //alert("Didnt work");
}

