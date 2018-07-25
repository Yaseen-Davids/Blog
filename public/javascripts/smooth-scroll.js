// This is the smooth scroll effect


$(document).ready(function(){

    // This is the position of the contact section
    let theContPos = document.getElementById("contact-section").offsetTop - 50;
    // If user clicks on button, run function
    $("#goToCont").on('click', function(){
        // scroll to contact position
        $('html, body').animate({scrollTop: theContPos}, 2500);
    });

    // This is for the information section on the home page
    setTimeout(function(){
        $("#information-img").css('right', '20px');
    },2000);

    $("#information-img").on('click', function(){
        $("#information-box-main").fadeToggle("slow","linear");
        $("#information-box-main").on('click', function(){
            $(this).fadeToggle("slow", "linear");
        })
    });


    // This is for the logged in section on the home page
    setTimeout(function(){
        $("#logged-img").css('right', '20px');
    },2000);

    $("#logged-img").on('click', function(){
        $("#logged-in-main").fadeToggle("slow","linear");
        $("#logged-in-main").on('click', function(){
            $(this).fadeToggle("slow", "linear");
        })
    });
})