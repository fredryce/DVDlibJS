$(document).ready(function() {

	
})

//function called from edit and create form page
//when form is cancelled from the create and modify dvd page
function formCancelled(){
	$("#operationDVD").hide()

}

//takes in string either create or update
function operationDVD(operation){
	$("#operationTitle").textcontent(operation)
	//hide main container
	$("#operationDVD").hide()
}