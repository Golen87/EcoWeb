let defaultDatabase = JSON.stringify(
	{"version":3,"nodes":[{"id":1145,"name":"Bläckfisk","image":"missing","color":"#ff9200","description":null,"type":"animal","tags":[],"animal":{"size":"small","food":"carnivore","consumption":1,"weight":1,"age":3.5,"offspring":90000},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1145,"tags":[],"interaction":"predation","preference":100}]},{"id":27,"name":"Daggmask","image":"daggmask","color":"#453834","description":null,"type":"animal","tags":["Biome: Forest"],"animal":{"size":"tiny","food":"detritivore","consumption":"0.01","weight":"0.01","age":"6","offspring":"560"},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Lumbricus\n\n2,5g\näter 0,83g/dag","relations":[]},{"id":4,"name":"Dovhjort","image":"dovhjort","color":"#ac920d","description":null,"type":"animal","tags":["Trait: Fur","Legs: 4","Biome: Forest"],"animal":{"size":"large","food":"herbivore","consumption":"3.2","weight":"65","age":"13.5","offspring":"1.2"},"plant":{"size":"medium"},"fungi":{"size":"medium"},"abiotic":{},"service":{"category":null},"notes":"Latin: Dama dama","relations":[{"type":"node","node_id":15,"tags":[],"interaction":"herbivory","preference":50},{"type":"node","node_id":31,"tags":[],"interaction":"herbivory","preference":60},{"type":"node","node_id":16,"tags":[],"interaction":"herbivory","preference":40},{"type":"node","node_id":17,"tags":[],"interaction":"herbivory","preference":50}]},{"id":20,"name":"Duvhök","image":"duvhök","color":"#4f3a04","description":null,"type":"animal","tags":["Trait: Feathers","Legs: 2"],"animal":{"size":"medium","food":"carnivore","consumption":"0.17","weight":"1","age":"19","offspring":"3.5"},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Accipiter gentilis","relations":[]},{"id":1146,"name":"Havsfiskar","image":"havsfisk","color":"#0432ff","description":null,"type":"animal","tags":[],"animal":{"size":"medium","food":"carnivore","consumption":0.1,"weight":1,"age":11,"offspring":1000500},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1150,"tags":[],"interaction":"predation","preference":100},{"type":"node","node_id":1149,"tags":[],"interaction":"predation","preference":100},{"type":"node","node_id":1145,"tags":[],"interaction":"predation","preference":20}]},{"id":1105,"name":"Havsutter","image":"havsutter","color":"#5f3a41","description":"Uttrar är bäst!","type":"animal","tags":[],"animal":{"size":"medium","food":"carnivore","consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1109,"tags":[],"interaction":"predation","preference":90},{"type":"node","node_id":1145,"tags":[],"interaction":"predation","preference":8}]},{"id":21,"name":"Kattuggla","image":"kattuggla","color":"#d9bc99","description":null,"type":"animal","tags":["Trait: Feathers","Legs: 2","Biome: Forest"],"animal":{"size":"medium","food":"carnivore","consumption":"0.11","weight":"0.4","age":"15","offspring":"3.5"},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Strix aluco","relations":[{"type":"tags","node_id":-1,"tags":["Trait: Feathers"],"interaction":"mutualism","preference":100},{"type":"tags","node_id":-1,"tags":["Trait: Fur"],"interaction":"predation","preference":100}]},{"id":1107,"name":"Kelpfisk","image":"kelpfisk","color":"#da967a","description":null,"type":"animal","tags":[],"animal":{"size":"small","food":"herbivore","consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1106,"tags":[],"interaction":"herbivory","preference":100},{"type":"node","node_id":32,"tags":[],"interaction":"herbivory","preference":200}]},{"id":1108,"name":"Knubbsäl","image":"säl","color":"#57546f","description":null,"type":"animal","tags":[],"animal":{"size":"large","food":"carnivore","consumption":7,"weight":1,"age":47,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1146,"tags":[],"interaction":"predation","preference":100},{"type":"node","node_id":1145,"tags":[],"interaction":"predation","preference":100}]},{"id":22,"name":"Koltrast","image":"koltrast","color":"#1a1a22","description":null,"type":"animal","tags":["Trait: Feathers","Legs: 2"],"animal":{"size":"small","food":"omnivore","consumption":"0.3","weight":"0.1","age":"3","offspring":"16.5"},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Turdus merula","relations":[{"type":"node","node_id":15,"tags":[],"interaction":"herbivory","preference":100},{"type":"node","node_id":16,"tags":[],"interaction":"herbivory","preference":60},{"type":"node","node_id":30,"tags":[],"interaction":"herbivory","preference":60}]},{"id":18,"name":"Lo","image":"lo","color":"#b88e38","description":null,"type":"animal","tags":["Legs: 4","Trait: Fur","Biome: Forest"],"animal":{"size":"medium","food":"carnivore","consumption":1.5,"weight":25,"age":16.5,"offspring":2},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Lynx lynx","relations":[{"type":"node","node_id":10,"tags":[],"interaction":"predation","preference":10},{"type":"node","node_id":4,"tags":[],"interaction":"predation","preference":90},{"type":"node","node_id":8,"tags":[],"interaction":"predation","preference":40},{"type":"node","node_id":22,"tags":[],"interaction":"predation","preference":20}]},{"id":1149,"name":"Musslor","image":"mussla","color":"#ffd478","description":null,"type":"animal","tags":[],"animal":{"size":"tiny","food":"omnivore","consumption":0.02,"weight":0.2,"age":24,"offspring":22500000},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1150,"tags":[],"interaction":"herbivory","preference":90},{"type":"node","node_id":1106,"tags":[],"interaction":"herbivory","preference":20}]},{"id":23,"name":"Nötväcka","image":"norvacka","color":"#bbcddb","description":null,"type":"animal","tags":["Trait: Feathers","Legs: 2","Biome: Forest"],"animal":{"size":"small","food":"omnivore","consumption":"0.08","weight":"0.02","age":"12","offspring":"7.5"},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Sitta europaea\n\nAnvänder gamla hackspetts bon.","relations":[]},{"id":8,"name":"Rådjur","image":"rådjur","color":"#bf7b13","description":null,"type":"animal","tags":["Trait: Horns","Trait: Fur","Legs: 4"],"animal":{"size":"medium","food":"herbivore","consumption":"3","weight":"25","age":"10","offspring":"2"},"plant":{"size":"medium"},"fungi":{"size":"medium"},"abiotic":{},"service":{"category":null},"notes":"Latin: Capreolus capreolus","relations":[{"type":"node","node_id":31,"tags":[],"interaction":"herbivory","preference":100},{"type":"node","node_id":15,"tags":[],"interaction":"herbivory","preference":60},{"type":"node","node_id":30,"tags":[],"interaction":"herbivory","preference":30},{"type":"node","node_id":16,"tags":[],"interaction":"herbivory","preference":20},{"type":"node","node_id":17,"tags":[],"interaction":"herbivory","preference":10}]},{"id":1,"name":"Rödräv","image":"räv","color":"#cd471b","description":null,"type":"animal","tags":["Trait: Fur","Legs: 4","Biome: Forest"],"animal":{"size":"medium","food":"carnivore","consumption":1,"weight":7,"age":3.5,"offspring":4},"plant":{"size":"medium"},"fungi":{"size":"medium"},"abiotic":{},"service":{"category":null},"notes":"Latin: Vulpes vulpes","relations":[{"type":"node","node_id":10,"tags":[],"interaction":"predation","preference":50},{"type":"node","node_id":16,"tags":[],"interaction":"herbivory","preference":40},{"type":"node","node_id":30,"tags":[],"interaction":"herbivory","preference":20},{"type":"node","node_id":4,"tags":[],"interaction":"predation","preference":20},{"type":"node","node_id":8,"tags":[],"interaction":"predation","preference":20},{"type":"node","node_id":22,"tags":[],"interaction":"predation","preference":60}]},{"id":1109,"name":"Sjöborre","image":"sjöborre","color":"#bd535a","description":null,"type":"animal","tags":[],"animal":{"size":"small","food":"herbivore","consumption":1,"weight":1,"age":30,"offspring":14000000},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1106,"tags":[],"interaction":"herbivory","preference":100},{"type":"node","node_id":32,"tags":[],"interaction":"herbivory","preference":50},{"type":"node","node_id":1149,"tags":[],"interaction":"predation","preference":15}]},{"id":28,"name":"Skalbagge","image":"skalbagge","color":"#c98634","description":null,"type":"animal","tags":[],"animal":{"size":"tiny","food":"omnivore","consumption":"0.01","weight":"0.01","age":"4","offspring":"70"},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Träd (blommor, nektar, bark, ved, löv, frukt), Örter (planta, bär), As, Djur (Tiny), Detrius\n\nTags: Skal, insekt\n\nKlass: Skalbaggar","relations":[]},{"id":10,"name":"Skogshare","image":"hare","color":"#eda12c","description":null,"type":"animal","tags":["Trait: Fur","Legs: 4","Biome: Forest"],"animal":{"size":"small","food":"herbivore","consumption":"2.5","weight":"3","age":"3.5","offspring":"8.75"},"plant":{"size":"medium"},"fungi":{"size":"medium"},"abiotic":{},"service":{"category":null},"notes":"Latin: Lepus timidus","relations":[{"type":"node","node_id":31,"tags":[],"interaction":"herbivory","preference":100},{"type":"node","node_id":16,"tags":[],"interaction":"herbivory","preference":70},{"type":"node","node_id":17,"tags":[],"interaction":"herbivory","preference":40},{"type":"node","node_id":15,"tags":[],"interaction":"herbivory","preference":20}]},{"id":25,"name":"Snok","image":"snok","color":"#82c232","description":null,"type":"animal","tags":["Biome: Forest"],"animal":{"size":"small","food":"carnivore","consumption":1,"weight":"0.24","age":"26.5","offspring":"22.5"},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Natrix natrix","relations":[]},{"id":1111,"name":"Späckhuggare","image":"späckhuggare","color":"#212436","description":null,"type":"animal","tags":[],"animal":{"size":"megafauna","food":"carnivore","consumption":450,"weight":2000,"age":70,"offspring":0.16},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1108,"tags":[],"interaction":"predation","preference":75},{"type":"node","node_id":1105,"tags":[],"interaction":"predation","preference":23},{"type":"node","node_id":1148,"tags":[],"interaction":"predation","preference":10},{"type":"node","node_id":1147,"tags":[],"interaction":"predation","preference":20}]},{"id":1147,"name":"Stellers sjölejon","image":"säl","color":"#00fcff","description":null,"type":"animal","tags":[],"animal":{"size":"huge","food":"carnivore","consumption":35,"weight":1,"age":25,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1146,"tags":[],"interaction":"predation","preference":100},{"type":"node","node_id":1145,"tags":[],"interaction":"predation","preference":20}]},{"id":29,"name":"Trädlevande insekter","image":"trädlevandeinsekt","color":"#8f7a54","description":null,"type":"animal","tags":[],"animal":{"size":"tiny","food":"herbivore","consumption":"0.01","weight":"0.01","age":"4","offspring":"100"},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Insecta\n\nTräd (Bark, Ved)","relations":[]},{"id":1148,"name":"Val","image":"valar","color":"#0432ff","description":null,"type":"animal","tags":[],"animal":{"size":"gigantic","food":"omnivore","consumption":806,"weight":1,"age":1,"offspring":0.5},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1150,"tags":[],"interaction":"herbivory","preference":100}]},{"id":26,"name":"Vanlig groda","image":"vanliggroda","color":"#788d58","description":null,"type":"animal","tags":["Legs: 4"],"animal":{"size":"small","food":"carnivore","consumption":"0.01","weight":"0.02","age":"14","offspring":"1500"},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Rana temporaria","relations":[]},{"id":1110,"name":"Öronsäl","image":"öronsäl","color":"#5c3841","description":null,"type":"animal","tags":[],"animal":{"size":"medium","food":"carnivore","consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1107,"tags":[],"interaction":"predation","preference":100}]},{"id":16,"name":"Blåbär","image":"blåbär","color":"#2e58ff","description":null,"type":"plant","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Vaccinium myrtillus\n\nLjungväxter","relations":[]},{"id":17,"name":"Gräs","image":"gräs","color":"#0fd20d","description":null,"type":"plant","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Poaceae","relations":[]},{"id":1106,"name":"Jättekelp","image":"jättekelp","color":"#c3d442","description":"Lorem ipsum voluptate excepteur in pariatur duis irure dolore aliquip amet.\n\nExcepteur enim tempor sit ad ut veniam sed pariatur.","type":"plant","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1150,"name":"Plankton","image":"plankton","color":"#6bd4b5","description":null,"type":"plant","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":15,"name":"Träd","image":"träd","color":"#189122","description":null,"type":"plant","tags":["Biome: Forest"],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":null,"relations":[]},{"id":31,"name":"Örter","image":"ört","color":"#30b444","description":null,"type":"plant","tags":["Biome: Forest"],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":null,"relations":[]},{"id":30,"name":"Svamp","image":"svamp","color":"#cca66c","description":null,"type":"fungi","tags":["Biome: Forest"],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Latin: Fungi\n\nDetrivore","relations":[]},{"id":1051,"name":"Atmosfär","image":"missing","color":"#000000","description":null,"type":"abiotic","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":32,"name":"Detrius","image":"detrius","color":"#717062","description":null,"type":"abiotic","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":null,"relations":[]},{"id":1116,"name":"Havsfiske","image":"fiskebåt","color":"#000000","description":null,"type":"abiotic","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1107,"tags":[],"interaction":"amensalism","preference":100},{"type":"node","node_id":1108,"tags":[],"interaction":"amensalism","preference":5},{"type":"node","node_id":1147,"tags":[],"interaction":"amensalism","preference":5}]},{"id":1053,"name":"Jord","image":"missing","color":"#804000","description":null,"type":"abiotic","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1050,"name":"Luftfuktighet","image":"missing","color":"#00ffff","description":null,"type":"abiotic","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1048,"name":"Radiation","image":"missing","color":"#80ff00","description":null,"type":"abiotic","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1047,"name":"Solljus","image":"missing","color":"#ffff00","description":null,"type":"abiotic","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1052,"name":"Syra","image":"missing","color":"#80ff00","description":null,"type":"abiotic","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1049,"name":"Temperatur","image":"missing","color":"#ff0000","description":null,"type":"abiotic","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":31,"tags":[],"interaction":"herbivory","preference":100}]},{"id":1121,"name":"Utterjakt","image":"utterjägare","color":"#ff0000","description":null,"type":"abiotic","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[{"type":"node","node_id":1105,"tags":[],"interaction":"amensalism","preference":100}]},{"id":1046,"name":"Vatten","image":"missing","color":"#0000ff","description":null,"type":"abiotic","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1059,"name":"Avgiftning","image":"missing","color":"#ff00ff","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1069,"name":"Brunjord (Jordmån)","image":"missing","color":"#804000","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1057,"name":"Dricksvatten","image":"missing","color":"#0000ff","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1074,"name":"Klimatreglering","image":"missing","color":"#00ff00","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1075,"name":"Kolbindning","image":"missing","color":"#008000","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"Växters absorbtion av koldioxid och rening av luften.","relations":[]},{"id":1070,"name":"Livsmiljöskydd","image":"missing","color":"#ff00ff","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1058,"name":"Mat och skörd","image":"missing","color":"#ff00ff","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1063,"name":"Nettoprimärproduktion","image":"missing","color":"#00ff00","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1076,"name":"Pedogenesis","image":"missing","color":"#804000","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1054,"name":"Pollination","image":"missing","color":"#ff7700","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1067,"name":"Råmaterial","image":"missing","color":"#ff00ff","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1068,"name":"Vattenkraft","image":"missing","color":"#0000ff","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]},{"id":1055,"name":"Vattenrenhet","image":"missing","color":"#0000ff","description":null,"type":"service","tags":[],"animal":{"size":null,"food":null,"consumption":1,"weight":1,"age":1,"offspring":1},"plant":{"size":null},"fungi":{"size":null},"abiotic":{},"service":{"category":null},"notes":"","relations":[]}],"events":[{"id":1000,"name":"Stödmata","description":"Stödmatar man så ser man till så att hjortdjuren i ett område får extra mat över vintern så att färre dör på grund av svält.\nDet är vanligt att man gör detta så att man kan skjuta fler av dem under jaktsäsongen utan att det blir för få individer i ett område.","image":"detrius","duration":10,"owner_id":-1,"effects":[{"type":"tags","node_id":-1,"tags":["Trait: Fur"],"method":"relative","value":0.5}]},{"id":1039,"name":"Plantera skog","description":"Man kan plantera träd och på så vis få en större areal av landskapet att bli skog.\nMånga djur gynnas av skogen så som harar och rådjur, men även svampar och växter så som blåbär kan också gynnas av att det blir mer skog i landskapet.","image":"träd","duration":0,"owner_id":-1,"effects":[{"type":"node","node_id":15,"tags":[],"method":"relative","value":1}]},{"id":1040,"name":"Avverka skog","description":"Man kan hugga ned hela skogen och på så vis bli av med alla träd.\nMånga djur mår dåligt av att skogen försvinner så som dovhjort, rådjur, harar, rävar, och koltrastar. Även växter kan skadas av att skogen försvinner, blåbär tillexempel är beroende av skogen för sin överlevnad, samt många svamparter.","image":"träd","duration":0,"owner_id":-1,"effects":[{"type":"node","node_id":15,"tags":[],"method":"relative","value":1}]},{"id":1042,"name":"Jaga räv","description":"Man kan skicka ut jägare för att jaga räv, man kan jaga dem med ett drev hundar, lura dem nära med åtel och sedan skjuta dem, skicka in hundar i deras gryt, eller sätta ut fällor.\nMinskar man rävpopulationen på detta vis så gynnar man mest smådjur så som skogsharar och koltrastar.","image":"räv","duration":0,"owner_id":-1,"effects":[]},{"id":1041,"name":"Plantera in lodjur","description":"Planterar man in lodjur i ett område så kommer de att börja jaga de andra djuren i området. Lodjur är en hyperkarnivor vilket betyder att deras diet är mestadels kött och de kan inte överleva på en växtbaserad diet.\nLodjuren gillar främst att jaga stora hovdjur så som dovhjort och rådjur. De äter också mycket skogsharar och koltrastar, och kan även ta sig en räv ibland.","image":"lo","duration":0,"owner_id":-1,"effects":[{"type":"node","node_id":15,"tags":[],"method":"relative","value":1}]},{"id":1086,"name":"Coronavirus","description":"test","image":"svamp","duration":0,"owner_id":-1,"effects":[{"type":"tags","node_id":-1,"tags":[],"method":"relative","value":-0.5},{"type":"node","node_id":15,"tags":[],"method":"relative","value":-10}]},{"id":1091,"name":"Influensa","description":"test","image":"svamp","duration":0,"owner_id":-1,"effects":[{"type":"tags","node_id":-1,"tags":[],"method":"relative","value":0.25},{"type":"node","node_id":15,"tags":[],"method":"relative","value":0.25}]},{"id":1100,"name":"Öka rävar","description":null,"image":"räv","duration":0,"owner_id":-1,"effects":[{"type":"node","node_id":1,"tags":[],"method":"relative","value":1}]},{"id":1117,"name":"Ökat Fiske","description":"Gradvis ökning av fisket","image":"fiskebåt","duration":20,"owner_id":-1,"effects":[{"type":"node","node_id":1116,"tags":[],"method":"target","value":0.25}]},{"id":1122,"name":"Fridlys Uttrar","description":"Förbjud all form av jakt på uttrar...","image":"havsutter","duration":30,"owner_id":1121,"effects":[{"type":"node","node_id":1121,"tags":[],"method":"target","value":0}]},{"id":1123,"name":"Förbjud fiske","description":"Dags att sätta stopp för allt fiskande!","image":"havsfisk","duration":50,"owner_id":1116,"effects":[{"type":"node","node_id":1116,"tags":[],"method":"target","value":0.1}]},{"id":1130,"name":"Plantera in Havsutter","description":"Havsuttern äter sjöborrar. Vi kanske kan prova att plantera in havsuttrar som fötts upp i fångenskap","image":"havsutter","duration":15,"owner_id":1105,"effects":[{"type":"node","node_id":1105,"tags":[],"method":"relative","value":0.4}]},{"id":1131,"name":"Plantera tusen uttrar","description":"Köp många färska uttrar här!","image":"havsutter","duration":20,"owner_id":1105,"effects":[{"type":"node","node_id":1105,"tags":[],"method":"relative","value":3}]},{"id":1139,"name":"Öka","description":"Dags att sätta stopp för allt fiskande!","image":"fiskebåt","duration":10,"owner_id":1116,"effects":[{"type":"node","node_id":1116,"tags":[],"method":"relative","value":0.2}]},{"id":1140,"name":"Sätt 0.5","description":"Dags att sätta stopp för allt fiskande!","image":"fiskebåt","duration":10,"owner_id":1116,"effects":[{"type":"node","node_id":1116,"tags":[],"method":"target","value":0.5}]},{"id":1141,"name":"Halvera","description":"Dags att sätta stopp för allt fiskande!","image":"fiskebåt","duration":10,"owner_id":1116,"effects":[{"type":"node","node_id":1116,"tags":[],"method":"percentage","value":0.5}]},{"id":1151,"name":"Ökad Jakt","description":"Jakten på utter ökar över tid","image":"utterjägare","duration":30,"owner_id":-1,"effects":[{"type":"node","node_id":1121,"tags":[],"method":"relative","value":0.2}]},{"id":1152,"name":"Keep Späckhuggare happy","description":null,"image":"missing","duration":200,"owner_id":-1,"effects":[{"type":"node","node_id":1111,"tags":[],"method":"relative","value":1.5}]},{"id":1153,"name":"Plocka sjöborrar","description":"Något måste göras. Sjöborrarna blir bara fler och fler. Det verkar som att det är de som äter upp kelpen. ","image":"sjöborre","duration":12,"owner_id":1109,"effects":[{"type":"node","node_id":1109,"tags":[],"method":"relative","value":-0.25}]},{"id":1154,"name":"Inför Fiskekvoter","description":"Begränsa hur mycket havsfisk som får tas upp ","image":"fiskebåt","duration":15,"owner_id":1116,"effects":[{"type":"node","node_id":1116,"tags":[],"method":"target","value":0}]},{"id":1155,"name":"Valjakt","description":"Börja med skyddsjakt på späckhuggare","image":"missing","duration":100,"owner_id":1116,"effects":[{"type":"node","node_id":1111,"tags":[],"method":"target","value":0},{"type":"node","node_id":1148,"tags":[],"method":"target","value":0.05}]},{"id":1156,"name":"Lägg till plankton","description":"Vad händer om vi lägger till Plankton i nätverket?","image":"plankton","duration":5,"owner_id":1146,"effects":[{"type":"node","node_id":1150,"tags":[],"method":"relative","value":0.2}]},{"id":1157,"name":"Lägg till Sjölejon","description":null,"image":"missing","duration":5,"owner_id":1146,"effects":[{"type":"node","node_id":1147,"tags":[],"method":"relative","value":0.2}]},{"id":1159,"name":"Begränsa utterjakt","description":"Minska jakt på uttrar...","image":"havsutter","duration":20,"owner_id":1121,"effects":[{"type":"node","node_id":1121,"tags":[],"method":"percentage","value":0.75}]}],"scenarios":[{"id":1158,"name":"Kelpskogar - LEVEL 1 ","time":{"intro":50,"outro":50,"sections":5,"length":40,"playspeed":5,"fastspeed":50},"budget":100,"budgetreward":20,"research":1,"researchreward":1,"description":"Kelpskogarna i havet utanför den kaliforniska kusten är livsviktiga för flera arter av fisk och andra djur. Men man har börjat se tecken på att de håller på att minska. Ta reda på vad som är det bakomliggande problemet och rädda skogarna innan det är för sent.","stars":1,"position":[40,50],"actors":[{"node_id":1105,"population":0.14,"popfunc":"0.5","visibility":"explored","position":[40,18]},{"node_id":1109,"population":0.33,"popfunc":"0.5","visibility":"explored","position":[45,36]},{"node_id":1106,"population":0.66,"popfunc":"0.5","visibility":"explored","position":[40,54]},{"node_id":1121,"population":0.1,"popfunc":"0.05","visibility":"explored","position":[50,0]}],"actions":[{"event_id":1122,"type":"player","time":0,"cost":50},{"event_id":1130,"type":"player","time":0,"cost":35},{"event_id":1151,"type":"automatic","time":5,"cost":0},{"event_id":1153,"type":"player","time":0,"cost":15},{"event_id":1159,"type":"player","time":0,"cost":30}],"conditions":{"0":{},"1":{"1105":[0.03,0.14],"1106":[0.25,1],"description":"Genom att begränsa jakten på utter har du lyckats rädda en del av Kelpskogarna.\n\nDock är både kelp- och utterpopulationerna farligt låga och känsliga för yttre påverkan i det läget som vi har just nu. \n"},"2":{"1105":[0.15,1],"1106":[0.4,1],"description":"Bra jobbat! \n\nKelpskogarna har överlevt och inga andra arter är i obalans. "},"3":{"1105":[0.14,1],"1106":[0.5,1],"budget":[40,200],"description":"Du har lyckats rädda kelpskogarna! Bra jobbat!\n\nDessutom har vi en stabil utterpopulation och en väl fungerande näringsväv  "}}},{"id":1160,"name":"Kelpskogar - LEVEL 2","time":{"intro":50,"outro":50,"sections":5,"length":40,"playspeed":5,"fastspeed":50},"budget":100,"budgetreward":20,"research":1,"researchreward":1,"description":"Utanför kusten i Alaska har man börjat se tecken på att uttrarna minskar, att sjöborrarna börar bre ut sig, och att kelpskogarna minskar. ","stars":3,"position":[50,50],"actors":[{"node_id":1146,"population":0.29,"popfunc":"0.5","visibility":"explored","position":[35,60]},{"node_id":1105,"population":0.15,"popfunc":"0.5","visibility":"explored","position":[55,40]},{"node_id":1108,"population":0.1,"popfunc":"0.5","visibility":"unexplored","position":[40,40]},{"node_id":1149,"population":0.19,"popfunc":"0.5","visibility":"hidden","position":[47,70]},{"node_id":1109,"population":0.25,"popfunc":"0.5","visibility":"explored","position":[60,60]},{"node_id":1111,"population":0.33,"popfunc":"0.5","visibility":"explored","position":[40,20]},{"node_id":1147,"population":0.1,"popfunc":"0.5","visibility":"unexplored","position":[25,40]},{"node_id":1148,"population":0.1,"popfunc":"0.5","visibility":"hidden","position":[25,20]},{"node_id":1106,"population":0.73,"popfunc":"0.5","visibility":"explored","position":[60,80]},{"node_id":1150,"population":0.25,"popfunc":"0.5","visibility":"unexplored","position":[35,80]},{"node_id":1116,"population":0.1,"popfunc":"0.02","visibility":"explored","position":[10,20]},{"node_id":1121,"population":0.1,"popfunc":"0.01","visibility":"explored","position":[70,20]}],"actions":[{"event_id":1117,"type":"automatic","time":0,"cost":0},{"event_id":1130,"type":"player","time":0,"cost":25},{"event_id":1152,"type":"automatic","time":11,"cost":0},{"event_id":1154,"type":"player","time":0,"cost":25}],"conditions":{"0":{"description":"Tyvärr lyckades du inte med ditt uppdrag :( \n\nFörsök igen!!!"},"1":{},"2":{"1106":[0.45,1]},"3":{"1106":[0.55,1],"1108":[0.01,1],"1109":[0.1,1],"1111":[0.1,1]}}},{"id":1112,"name":"Havet","time":{"intro":50,"outro":50,"sections":5,"length":40,"playspeed":10,"fastspeed":50},"budget":100,"budgetreward":20,"research":1,"researchreward":1,"description":"Lorem ipsum voluptate excepteur in pariatur duis irure dolore aliquip amet sed sint quis exercitation.\n\nExcepteur enim tempor sit ad ut veniam sed pariatur nisi mollit qui esse.","stars":0,"position":[70,60],"actors":[{"node_id":1105,"population":0.2,"popfunc":"0.5","visibility":"explored","position":[80,40]},{"node_id":1108,"population":0.1,"popfunc":"0.5","visibility":"explored","position":[60,40]},{"node_id":1110,"population":0.1,"popfunc":"0.5","visibility":"explored","position":[40,40]},{"node_id":1111,"population":0.1,"popfunc":"0.5","visibility":"explored","position":[60,20]},{"node_id":1107,"population":0.1,"popfunc":"0.5","visibility":"explored","position":[40,60]},{"node_id":1109,"population":0.5,"popfunc":"0.5","visibility":"explored","position":[70,60]},{"node_id":1106,"population":0.7,"popfunc":"0.5","visibility":"explored","position":[60,80]},{"node_id":32,"population":0.1,"popfunc":"1","visibility":"explored","position":[40,80]},{"node_id":1116,"population":0.1,"popfunc":"0.1","visibility":"explored","position":[20,40]},{"node_id":1121,"population":0.1,"popfunc":"0.1","visibility":"explored","position":[80,20]}],"actions":[{"event_id":1117,"type":"automatic","time":50,"cost":0},{"event_id":1122,"type":"player","time":0,"cost":60},{"event_id":1130,"type":"player","time":0,"cost":30},{"event_id":1131,"type":"player","time":0,"cost":100},{"event_id":1139,"type":"player","time":0,"cost":1},{"event_id":1140,"type":"player","time":0,"cost":1},{"event_id":1141,"type":"player","time":0,"cost":1}],"conditions":{"0":{"description":"Du räddade inte uttrarna..."},"1":{"1105":[0.1,1],"description":"Du räddade uttrarna!\n\nMen kelpen mår inte bra."},"2":{"1105":[0.1,1],"1106":[0.2,1],"description":"Du räddade uttrarna och kelpen!\n\nMen späckhuggarna mår inte bra."},"3":{"1105":[0.1,1],"1106":[0.3,1],"1111":[0.1,1],"budget":[200,400],"description":"Du räddade planeten!"}}}],"tags":["Trait: Fur","Trait: Feathers","Trait: Horns","","Legs: 2","Legs: 4","Legs: 8","","Biome: Forest"]}
);