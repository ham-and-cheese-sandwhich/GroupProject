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
    add:true,
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
    
}


var currentLocation = "";


function onSuccess(position) {

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

            
            console.log(" Before returning: " + city.results[0].locations[0].adminArea5);
            
            currentLocation = city.results[0].locations[0].adminArea5;
            var currentStreet = city.results[0].locations[0].street;
            
            console.log("Before saving: " + currentLocation);
    
            var app = document.getElementById("app");
            var overlay = document.createElement("div");
            overlay.id = "overlay";

            overlay.innerHTML = "";

            app.appendChild(overlay);

            document.getElementById("home").style.display="none";
            add = true;
            var string = '<section role="region"><header><h1>New Contact</h1></header></section><form><fieldset><input id = "formNameFirst"  type="text" placeholder="First Name" value="" required><input id = "formNameLast" type="text" placeholder="Last Name" value="" required><input id = "formTel" type="tel" placeholder="Phone number" value="" required><input id = "formEmail" type="text" placeholder="Email" value="" required><input id = "formStreet" type="text" placeholder="Street" value="'+currentStreet+'" required><input id = "formCity" type="text" placeholder="City" value="'+currentLocation+'" required><input id = "formZip" type="text" placeholder="Zip Code" value="'+city.results[0].locations[0].postalCode+'" required><button id="saveContact">Save</button></form>';

            overlay.innerHTML += string;
            document.getElementById("saveContact").addEventListener("click", function(e){
                e.preventDefault();
                saveContact(formNameFirst.value, formNameLast.value, formTel.value, formEmail.value, formStreet.value, formCity.value, "");
            });

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
   
    contactExist();
    
}, false);

console.log("setting event");
document.getElementById("addContact").addEventListener("click", newContact, false);


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
        contactItem.addEventListener("click", function(){
            
            var splitted = this.id.split("-");
            var app = document.getElementById("app");
            var overlay = document.createElement("div");
            overlay.id = "overlay";

            overlay.innerHTML = "";

            app.appendChild(overlay);

            document.getElementById("home").style.display="none";
            
            var phoneNum;
            if (contacts[splitted[1]].phoneNumbers[0]){
                phoneNum = contacts[splitted[1]].phoneNumbers[0].value;
            }else{
                phoneNum = "";
            }
            add = false;
            var string = '<section role="region"><header><h1>Edit Contact</h1></header></section><form><fieldset><input id = "formNameFirst" type="text" placeholder="First Name" value="'+contacts[splitted[1]].name.givenName+'" required><input id = "formNameLast" type="text" placeholder="Last Name" value="'+contacts[splitted[1]].name.familyName+'" required><input id = "formTel" type="tel" placeholder="Phone number" value="'+phoneNum+'" required><input id = "formEmail" type="text" placeholder="Email" value="'+contacts[splitted[1]].emails[0].value+'" required><input id = "formStreet" type="text" placeholder="Street" value="'+contacts[splitted[1]].addresses[0].streetAddress+'" required><input id = "formCity" type="text" placeholder="City" value="'+contacts[splitted[1]].addresses[0].locality+'" required><button id="saveContact">Save</button></form>';

            overlay.innerHTML += string;                               
            
            document.getElementById("saveContact").addEventListener("click", function(e){
                e.preventDefault();
                var formNameFirst = document.getElementById("formNameFirst").value;
                var formNameLast = document.getElementById("formNameLast").value;
                var formTel = document.getElementById("formTel").value;
                var formEmail = document.getElementById("formEmail").value;
                var formStreet = document.getElementById("formStreet").value;
                var formCity = document.getElementById("formCity").value;
                saveContact(formNameFirst, formNameLast, formTel, formEmail, formStreet, formCity, contacts[splitted[1]].id);
            });
            
            
        }, false);
    }
    
    console.log("displaying");
    
		
    }

function displayError(){
    console.log("display Didnt work");
}

function saveSuccess(i){ 
    if(i == 4){
        
        setTimeout(function(){publishContacts();}, 1000);
    }
}

function saveError(){
    //alert("Didnt work");
}

function editContact(contacts){
}

function newContact(){
    console.log("new contact!");

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    
}

function saveContact(firstName, lastName, telephone, email, street,city, contactId){
    console.log("First Name : " + firstName);
    console.log("Last Name : " + lastName);
    console.log("Telephone : " + telephone);
    console.log("E-Mail : " + email);
    console.log("Street : " + street);
    console.log("City : " + city);
    console.log("contactId : " + contactId);
    
    contact = navigator.contacts.create();
    contact.displayName = firstName + " " + lastName;

    newName = new ContactName();
    newName.givenName = ""+firstName+"";
    console.log(firstName);
    newName.familyName = ""+lastName+"";
    console.log(lastName);
    contact.name = newName;
    contact.id = contactId;


    var phoneNumbers = [];
    phoneNumbers[0] = new ContactField("mobile", telephone, false);
    contact.phoneNumbers = phoneNumbers;

    var emails = [];
    emails[0] = new ContactField("email", email, false);
    contact.emails = emails;

    var addresses= [];
    var address = new ContactAddress();
    address.locality = city;
    address.streetAddress = street;
    address.type = "Home";
    address.region = city;

    addresses[0]= address;

    contact.addresses = addresses;

    contact.save(saveNewContact,saveNewContactError);
      
}

function saveNewContact(){
    console.log("yay!");
    
    var overlay = document.getElementById("overlay"); // grabs the overlay
    overlay.parentElement.removeChild(overlay); // has it's parent remove it
    document.getElementById("contacts").innerHTML = ""; // empties out the contacts to allow updating
    document.getElementById("home").style.display="block"; // make the home page appear again
    publishContacts(); //replaces all the contacts
}

function saveNewContactError(){
    console.log("noo");
}

//Checks if there are any contacts in the phone
function contactExist()
{
    var options = new ContactFindOptions();
    options.filter="";          // empty search string returns all contacts
    options.multiple=true;      // return multiple results
    filter = ["displayName"];   // return contact.displayName field
    // find contacts
    navigator.contacts.find(filter, yesContact, noContact, options);    
}


// onSuccess: Get a snapshot of the current contacts
    //
    function yesContact(contacts) 
    {
        if(contacts.length == 0)
        {
            //since there are no contacts, pull the information from the JSON file
            contactPull();
        }
        else
        {
            //since there are contacts, publish those contacts
            publishContacts()
        }
    };

    // onError: Failed to get the contacts
    //
    function noContact(contactError)
    {
        console.log("No contacts are saved");
    }