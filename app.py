from flask import Flask, request, render_template_string, redirect

app = Flask(__name__)

@app.route('/')
def home():
    # This is the main page with a button to start OAuth
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Twitch OAuth Flow</title>
    </head>
    <body>
        <h1>Welcome to the Twitch OAuth Flow</h1>
        <p>Click below to authenticate with Twitch:</p>
        <button onclick="startOAuth()">Start OAuth</button>

        <script>
            function startOAuth() {
                // Redirecting to Twitch's OAuth URL
                const yourClientId = '782s29ql389kw9ie7sdxvgx1vsdebh';
                const yourRedirectUri = 'http://localhost:3000/redirect'; // Redirect URI
                const oauth_url = `https://id.twitch.tv/oauth2/authorize?client_id=${yourClientId}&redirect_uri=${yourRedirectUri}&response_type=token&scope=chat:read%20user:read:chat`;

                window.location.href = oauth_url; // Redirect to Twitch for authentication
            }
        </script>
    </body>
    </html>
    """
    return render_template_string(html_content)

@app.route('/redirect')
def oauth_redirect():
    # This is the redirect page that reads the OAuth token from the URL hash
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Twitch OAuth Redirect</title>
    </head>
    <body>
        <h1>OAuth Successful! 🎉</h1>
        <p>Now displaying the access token from Twitch:</p>
    <script>
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1)); // Remove the '#' and parse
    const token = params.get('access_token');

    if (token) {
        document.body.innerHTML += `<p><strong>Access Token:</strong> ${token}</p>`;

        // Send access token to backend
        fetch('http://localhost:4000/api/store-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "accessToken": token })
        })
        .then(res => res.json())
        .then(data => console.log('Server response:', data))
        .catch(err => console.error('Error sending token:', err));
    } else {
        document.body.innerHTML += `<p style="color:red;">No access token found in URL.</p>`;
    }
</script></body>
    </html>
    """
    return render_template_string(html_content)

if __name__ == '__main__':
    app.run(port=3000)

