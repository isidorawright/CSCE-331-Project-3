const el = document.createElement('div');

el.innerHTML = `
  <div id="google_translate_element"></div>
  
  <script type="text/javascript">
      function googleTranslateElementInit() {
          new google.translate.TranslateElement(
              {pageLanguage: 'en'},
              'google_translate_element'
          );
      }
  </script>

  <script type="text/javascript" src= "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit">
  </script>`;

const box = document.getElementById('box');

box?.appendChild(el);
