(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.form-validate')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        const password = form.querySelector('#password')
        const confirmPassword = form.querySelector('#confirmPassword')
        const errorMsg = form.querySelector('.errorMsg')

        // Real-time password matching validation
        confirmPassword.addEventListener('input', () => {
            const passwordValue = password.value
            const confirmPasswordValue = confirmPassword.value

            // Check if passwords match and display message
            if (passwordValue !== confirmPasswordValue) {
                errorMsg.textContent = 'Passwords do not match*'
            } else {
                errorMsg.textContent = '' // Clear error message if passwords match
            }
        })

        // Form submission handler
        form.addEventListener('submit', event => {
            const passwordValue = password.value
            const confirmPasswordValue = confirmPassword.value

            // Prevent form submission if passwords do not match
            if (passwordValue !== confirmPasswordValue) {
                event.preventDefault() // Prevent form submission if passwords don't match
                errorMsg.textContent = 'Passwords do not match*'
            }

            // Check form validity
            if (!form.checkValidity()) {
                event.preventDefault() // Prevent form submission if form is not valid
                event.stopPropagation() // Stop the event from propagating
            }

            // Apply Bootstrap validation styles
            form.classList.add('was-validated')
        }, false)
    })
})()