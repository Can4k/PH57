import store from "@/store";

export default new class {
    constructor() {
        this.AllowedDomain =  '@sch57.ru';
    }

    /**
     * Создает форму для входа по Google's OAuth 2.0
     */
    oauthSignIn() {
        // Google's OAuth 2.0 endpoint for requesting an access token
        const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    
        // Create <form> element to submit parameters to OAuth 2.0 endpoint.
        const form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);
    
        // Parameters to pass to OAuth 2.0 endpoint.
        const params = {
            'client_id': '64741224597-jndp4rprf84q077hf5n8bcgq9i1c4sdo.apps.googleusercontent.com',
            'redirect_uri': store.state.domain,
            'response_type': 'token',
            'scope': 'https://www.googleapis.com/auth/userinfo.email',
            'include_granted_scopes': 'false',
        };
    
        // Add form parameters as hidden input values.
        for (const p in params) {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }
    
        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
    }

    /**
     * Проверяет email на соответствие домена
     * @param {String} email 
     * @returns {Boolean} Результат проверки
     */
    verifyEmail(email) {
        if (typeof email !== 'string') {
            return false;
        }

        try {
            const EmailDomain = email.slice(email.indexOf('@'));
            if (EmailDomain !== this.AllowedDomain) {
                throw 'Неверный email'
            }

            return true;
        } catch (e) {
            return false;
        }
    }
}