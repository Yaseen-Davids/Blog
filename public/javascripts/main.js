$(document).ready(function(){
    // This is the Summernote code
    $('#summernote').summernote({
        height: 200,
        placeholder: 'Text here'
    });

    // If contact me button clicked, run function
    $("#contactMe-button").on('click', function() {
        $(this).fadeOut('500');                             // fade button out
        $("#contact-section").css('height', '400px');       // increase contact section height
        $("#myForm").css('display', 'block');               // show form

        /* This is code runs after 0.5 seconds */
        setTimeout(function(){
            $("#myForm").css('opacity', '1');               // change form opacity to 1
        },500);

    });

    // This is the ajax delete function
    // Delete button clicked, run function
    $('.delete-blog').on('click', function(e){

        // Confirmation message
        let confirmDelete = confirm("Are you sure you want to delete the post ?");

        if (confirmDelete == true){
            // target event
            let target = $(e.target);

            const id = target.attr('data-id');

            // Ajax function
            $.ajax({
                method: 'DELETE',
                url: '/post/'+id,
                success: function(response){
                    window.location.href="/";
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
        else {}

    });
});