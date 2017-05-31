//file = require("file");
const PATH = require('path');
const dirTree = require('directory-tree');
const iptc = require('node-iptc');
const fs = require('fs');

basepath = '';
var tree = '';
keywordlist = [];

$( function() {
  $( ".draggable" ).draggable();
  $( ".droppable" ).droppable({
    drop: function( event, ui ) {
      $( this )
        .addClass( "ui-state-highlight" )
        .find( "p" )
          .html( "Dropped!" );
    }
  });
});
$( function() {
  $( "#sidebar" ).tabs();
} );

// Get folder when input changed
$("#pick-folder").change(function(){
  //chooseFile('#fileDialog');
  basepath = $(this).val();
  $("#basepath").text(basepath);
  console.log(basepath);
  GetFileTree(basepath);
});

function GetFileTree (basepath) {
  tree = dirTree(basepath);
  $('#treeview ul').html('')
  PopulateTreeUI(tree, $('#treeview ul'));
  console.log(tree);
  console.log(keywordlist);
}

function PopulateTreeUI(branch, element) {
  // if it's a dir, then add a UL
  if (branch.type == 'directory') {
    var li = element.append("<li><button>" + branch.name + "</button></li>").find('li');
    if (branch.children.length > 0) {
      var ul = li.append('<ul></ul>').find('ul');
      for (var i = 0; i < branch.children.length; i++){
        var child = branch.children[i];
        PopulateTreeUI(child, ul);
        //console.log(child);
      }
    }
  }
  else {
    var keywords = GetIptcKeywords(branch);
    //var li = element.append("<li>" + branch.name + "</li>").find('li');
    //console.log(keywords);
  }
}

function GetIptcKeywords (branch){
  var file = branch.path
  var keywords = []
  fs.readFile(file, function(err, data) {
    if (err) { throw err }
    iptc_data = iptc(data);
    keywords = iptc_data['keywords'];
    if (iptc_data.hasOwnProperty("keywords")) {
      keywords = iptc_data['keywords'];
      branch['keywords'] = keywords;
      AddToKeywordList(keywords);
    }
    //console.log(iptc_data);
  });
  return keywords;
}

function AddToKeywordList(arr) {
  for (var i = 0; i < arr.length; i++) {
    var kw = arr[i];
    if (!keywordlist.includes(kw)) {
      keywordlist.push(kw);
    }
  }
  keywordlist.sort();
  BuildTagList();
}

function BuildTagList() {
  console.log(keywordlist.length)
  $('#tags ul').html('');
  for (var i = 0; i < keywordlist.length; i++) {
    var kw = keywordlist[i];
    console.log(kw);
    $('#tags ul').append('<li class="tag draggable">' + kw + "</li>");
  }
}
