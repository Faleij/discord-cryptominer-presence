# Discord Cryptominer Presence

[![License][license-image]](LICENSE)
[![Donate][donate-image]][donate-url]

Display rich cryptomining presence on discord.  
Sets your discord presence as "Playing Cryptominer"
Example presence details:
```
Mining ETH at eu1.ethermine.org
80 MH/s, 50°C
13:37:00 elapsed
```

# Build
```bash
npm run build
```
Now the binaries are in dist folder.  
The _debug version launches with terminal output

# Config
Default configured to connect to localhost:3333.
See config.example.ini to specify other addresses. Multiple addresses may be used with a comma separator.
Remove .example from the name and put it in dist folder if you need to specify claymore/phoenixminer address and port.

# Gotchas
* Only Windows is supported at the moment.
* No uninstaller yet, manually remove links from startmenu to remove it.

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[donate-image]: https://img.shields.io/badge/Donate-PayPal-green.svg
[donate-url]: https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=faleij%40gmail%2ecom&lc=GB&item_name=faleij&item_number=jsonStreamStringify&currency_code=SEK&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted