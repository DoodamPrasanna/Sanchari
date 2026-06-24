// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

/* Navbar */
const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");

if(profileBtn){

    profileBtn.addEventListener("click", () => {
        profileMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {

        if(
            !profileBtn.contains(e.target) &&
            !profileMenu.contains(e.target)
        ){
            profileMenu.classList.remove("active");
        }

    });

}

