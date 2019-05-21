
"use strict";

var objetSelectione;

// Ce lien est dynamique, il faut utiliser une ID
var croix_lien = "img/croix.jpg";

var etagere, espace_cliquable, conteneurGuache, espace, panneauDroit ;
var etagereTip = []
var scene = [];
var xx,yy,urlSaisi ;
var tip;
var mesObjet ;
var id = 0;
  var menu = [
      {
        title: 'height',
        idRange: 'rangeH',
        action: function(){return;}
      },
      {
        title: 'width',
        idRange: 'rangeW',

        action: function() {return;}
      }
    ];


function init() {

		// La zone mère à gauche, qui a un contour noir
	  conteneurGuache = d3.select("#scene").append("svg").
	  attr("id", "svg_container").
	   attr("style", "border:2px solid black").
       attr("width", 510). 
       attr("height", 505);
	   
	  // L'espace utilisée pour le dessin
	  // Il s'agit d'un autre svg dans la zone mère
	  
      espace=  conteneurGuache.append("svg").
	  attr("id", "object_space").
       attr("width", 510). 
       attr("height", 505); 
	   
	  // Le panneau à droite qui contient les objets/images 
      panneauDroit=  d3.select("#scene").append("svg").
	  attr("id", "object_panel").
       attr("width", 70). 
       attr("height", 505); 




	//2 ajouter un rectangle où on va dessiner nos images

	// L'objet SVG est vide par défaut, et lorsqu'on clique sur le vide
	// l'évenement "click" ne fera rien, et la fonction dessinerNewObject
	// ne sera pas exécutée.
	// Donc il faut aujouter un rectangle qui va recevoir les cliques
	// et exécuter la fonction dessinerNewObject.

	espace_cliquable = espace.append("rect")
       .attr("x","0")
       .attr("y","0")
       .attr("width","510")
       .attr("height","505")
       .attr("fill-opacity","0.0") // transparent
       .on("click", dessinerNewObject); 
	   
  etagere = espace.append("svg:image")
       .attr("xlink:href", "./img/etagere.jpg") 
       .attr("width","250")
       .attr("height","250")
       //le click sur l etagère va déclancher l' ajout de tip(infobull)
	   .on("click", ajoutertip); 


       


       //3 charger les data d'un fichier json
	   
      $.getJSON("img/img.json", function(data){
     
 // chemin 
    $.each(data, function(i, field){   
      console.log("field.lien: "+field.lien);


      //récuperer les champs dont on a besoin
   var lien = field.lien; 
   var x = field.x;
   var y = field.y;




  // ajouter une image
       panneauDroit.append("svg:image") 
       .attr("xlink:href", lien) // le lien vers le chemin
       .attr("x",10) 
       .attr("y",y)
       .attr("width","50")
       .attr("height","50")
       .on("click", function(){ 
        console.log("image clickée !");  
            objetSelectione = d3.select(this); // achque foix qu'on clique sur l'image on recupere  et la valeur et on la donne objetselection 

});   
     });
  });

//chager le cache
// Retrieve the object from storage
var cacheScene = JSON.parse(localStorage.getItem('scene'));

if(cacheScene){
console.log(JSON.stringify(cacheScene));
for(let i in cacheScene){
  // reinitialisation de id selon le denier element de cache, et si on ajoute un nouveau element on incrimente de 
  //1
 id = cacheScene[i].id;
//ajouter à la scene
scene.push(cacheScene[i]);
  var imageCache=espace.append("svg:image")
    .attr("xlink:href",cacheScene[i].lien)
    .attr("id",cacheScene[i].id) 
    .attr("x",cacheScene[i].x)
    .attr("y",cacheScene[i].y)
    .attr("width","50")
    .attr("height","50")
    .attr("preserveAspectRatio","none"); // c'est pour préserver la forme de l'image 
    //.call(drag)
    imageCache.on("dblclick", function(){  // ici aussi on fait appelle a un autre evenement qui est de type double click qui fait appelle a cettte fonction qui selectionne cette element qui est l image et le suprime 
        var imageSupprime=d3.select(this)       
        
        var idSupprime = imageSupprime.attr("id");
        imageSupprime.remove();
        for(let element in scene){
          console.log("scene[element].id:"+scene[element].id);
          console.log(scene[element].id == idSupprime);
          if (scene[element].id == idSupprime){
            scene.splice(element,1);
            console.log("scene aprés suprimer:"+ scene);
          } 
        }
        console.log("idSupprime:"+idSupprime);
      })

imageCache.on('contextmenu', d3.contextMenu(menu,imageCache));
}
}


    }

	
function dessinerNewObject(){ 
if(objetSelectione){
	// On n'a pas besoin d'ajouter le croix dans
	// l'espace des objets, sauf si on veut l'enregistrer
	// dans le scene.
  if(objetSelectione.attr("xlink:href")===croix_lien){
	  return;
  }
  
  
  
//drag image( mouvement de l'image )
  var drag = d3.drag()
    .on("drag", dragmove);  
    // Extract the click location\ 
  var point = d3.mouse(this)
  , p = {x: point[0], y: point[1] }; // recuprer le point ou j ai cliquer (x et y)

  



//ajouter un nouveau objet selectionné ds le rec

 var nouveauObjet=espace.append("svg:image")
    .attr("xlink:href",objetSelectione.attr("xlink:href"))
    .attr("id", function(){return id = id+1;})
    .attr("x",p.x)
    .attr("y",p.y)
    .attr("width","50")
    .attr("height","50")
    .attr("preserveAspectRatio","none") // c'est pour préserver la forme de l'image 
    .call(drag)
    .on("dblclick", function(){  // ici aussi on fait appelle a un autre evenement qui est de type double click qui fait appelle a cettte fonction qui selectionne cette element qui est l image et le suprime 
        d3.select(this)       
        .remove();
      })

nouveauObjet.on('contextmenu', d3.contextMenu(menu,nouveauObjet));
  // POUR AFFICHER LES LOG DANS LA CONSOLE(RELEMENT LES ATTRIBUTS DE L OBJETSELECTIONE)
  console.log("nouveauObjet///: "+nouveauObjet);
  console.log("nouveauObjet"+nouveauObjet.attr("xlink:href"));
  console.log("attr x :"+nouveauObjet.attr("x"));
  console.log("attr y:"+nouveauObjet.attr("y"));
  console.log("nouveauObjet"+nouveauObjet.attr("width"));
  console.log("nouveauObjet"+nouveauObjet.attr("height"));

    
    
    
      // declarer une liste d'atributs
      var listObjetAttribu={"id":0,"type":"image","lien":"table.jpg","x":"510","y":"10"};
     
      listObjetAttribu["id"]= id;
      listObjetAttribu["lien"]=nouveauObjet.attr("xlink:href");
      listObjetAttribu["x"]=nouveauObjet.attr("x");
      listObjetAttribu["y"]=nouveauObjet.attr("y");

      
//PUSH C EST FONCTION JS POUR REMPLIR UN TABLEAU
    scene.push(listObjetAttribu);
    console.log ("scene: "+JSON.stringify(scene));

 // stocker le nouveau objet ds localstorage
  
/*localStorage.setItem('scene', JSON.stringify(scene));
var localstorageDepui = JSON.parse(localStorage.getItem('scene'));
console.log("depuislocal tout:"+JSON.stringify(localstorageDepui[0]));*/

/*localStorage.setItem('mesObjet', JSON.stringify(nouveauObjet));
console.log("nouveauObjet.attr(id):"+nouveauObjet.attr("id"));
console.log("cache mesObjet: "+localStorage.getItem('mesObjet'));
var monObjet1 = JSON.parse(localStorage.getItem('mesObjet'));
monObjet1.attr("x");*/
// Retrieve the object from storage
//var dataStokeLocalStorage = localStorage.getItem('scene');///???

//console.log('dataStokeLocalStorage: ', JSON.parse(dataStokeLocalStorage));
    }
}



// deplacer l image
function dragmove(d) {
  var x = d3.event.x;
  var y = d3.event.y;
  console.log("ici"+"x:"+x+"y"+y);
  d3.select(this).attr("x",x)
    .attr("y",y);
}

function enregistrement() {

  console.log("SAVE");
  localStorage.setItem('scene', JSON.stringify(scene));
localStorage.setItem('etagereTip', JSON.stringify(etagereTip));

  for (let objet of scene) {
      for (let p in objet) {

            console.log(p+" : "+objet[p]);

      }

  }
}

// foction infobulle
function ajoutertip(){
var url ;
 tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  //instancie l'objet tip puis le rempli nous on a mis dedans les label url,saisir un lien et botton enregi 
  .html( function(d){ 
    var v = 
    'Url:'
       +'<a id="url" href= '+url+'>' + '</a>'                     
       + '<br/>'
       +'<div class="divForm">'
      // +'<form>'
       +'<label for="myLien"> Saisir un lien:</label>'
       //au click sur la croix la tip sera caché
//cette fonction grace a d3 elle capte le id de cette input #myLien  at caque modif dedans elle recupere la valeur saisie ligne 325
       +'<input type="text" id="myLien" name="myLien" onClick= "saisirUrl()" ><br>'
      //le click sur le boutton enregistrer va executer la fonction saveUrl()
      +'<input value="Enregistrer" type="button" onClick= "saveUrl()"><br>'
      // + '<input type="submit" value="save"/>'
     //  +'</form>'
       +'</div>\
	   <style>\
	   .divForm{\
		padding: 4px;\
	   }\
	   .divForm input{\
		margin-top: 4px;\
	   }\
	   </style>';
    return v;
   } );



//capter le point de localisation de lasourie là on va déposer la croix
  var point = d3.mouse(this)
  , p = {x: point[0], y: point[1] };

  xx= p.x;
  yy=p.y;
  //on a mis une condition pour permettre de déposer juste les images dont le nom est croix_lien
  if(objetSelectione.attr("xlink:href")===croix_lien){
	//le dessin de la croix 
  espace.append("svg:image")
    .attr("class","croix")
    .attr("xlink:href",objetSelectione.attr("xlink:href"))
    .attr("x",p.x)
    .attr("y",p.y)
    .attr("width","20")
    .attr("height","20")
    // c ici qu'on ajoute vraiment la tip
    .call(tip)
    //au passage de la souris sur la croix on fait apparatre la tip
    .on('mouseover', tip.show)
  //au click sur la croix la tip sera caché
    .on('click', tip.hide);


  }
}




// Zooming 
// var zoom_handler = d3.zoom()
    // .on("zoom", zoom_actions);
// function zoom_actions(){
  // espace.attr("transform", d3.event.transform);
// }
// zoom_handler(d3.select("#scene"));


// menu contextuel

function resize(d, i, e, o, v){
	/**********************
	 d = Le slider qu'on changé
	 i = index
	 e = 
	 o = l'objet ou l'image qu'on vient de cliquer
	 v = la valeur du slider
	
	
	***************************/
  // REDIMENTIONNER L IMAGE AVEC LE MENU CONTEXTUEL
		switch(d.idRange){
			case "rangeH":
				o.attr("height", v);
				d3.selectAll("#nHeight-value").text(v);
				d3.selectAll("#rangeH-value").text(v);
			break;
			case "rangeW":
				o.attr("width", v);
				d3.selectAll("#nWidth-value").text(v);
				d3.selectAll("#rangeW-value").text(v);
			break;
			default:
			break;
		}
}


// saisir l url dans le input et afficher le lien en haut sous forme de lien clicable 
function saisirUrl(){
  console.log("récuperer les valeur des input..");
 
 //when the input lien sur la croix
d3.select("#myLien").on("input", function() {
  console.log("on est ds input tip");
  console.log ("la lien saisi: "+ this.value)
  urlSaisi = this.value;
  //apres cette la copie dans url: lien (en haut de input) sous form de lien clickable 
  d3.select("#url").text(urlSaisi);
  d3.select("#url").property("href", urlSaisi);

  
 
});

}

function saveUrl(){

//stockage ds localstorage


      // declarer une liste d'atributs
      var listTipAtribut={"type":"image","url":"https://www.google.fr/","x":"510","y":"10"}; // initialisation 
      listTipAtribut["url"]=urlSaisi;
      listTipAtribut["x"]=xx;
      listTipAtribut["y"]=yy;
      if(urlSaisi){
//PUSH C EST FONCTION JS POUR REMPLIR UN TABLEAU
    etagereTip.push(listTipAtribut);
    console.log ("etagereTip: "+JSON.stringify(etagereTip));
 // stocker le nouveau objet ds localstorage
  
//localStorage.setItem('etagereTip', JSON.stringify(etagereTip));///???

// Retrieve the object from storage
//var dataStokeLocalStorage = localStorage.getItem('etagereTip');???
}
// fermer le tip
tip.hide();
}

