# GitHub Pages and custom domain

The repository is `greatcoltini/greatcoltiniindustries-website`. The correct local checkout is `C:\Users\colto\Documents\github\greatcoltiniindustries-website`.

The GitHub Actions workflow builds, tests, and deploys `main`. The repository is public with the owner’s approval, and Pages is configured to deploy using **GitHub Actions**.

## Domain setup

The source already sets `site: https://greatcoltiniindustries.com`, root-relative links, trailing slashes, canonical metadata, sitemap, robots.txt, and `public/CNAME`. No repository `base` path is needed with this custom domain.

1. In GitHub account **Settings → Pages**, add and verify `greatcoltiniindustries.com`. Copy GitHub’s generated TXT name/value into the domain’s DNS. Keep the TXT record after verification.
2. In repository **Settings → Pages**, set the custom domain to `greatcoltiniindustries.com`.
3. In the domain provider’s DNS editor, replace the existing apex forwarding/A record with these GitHub Pages A records (`@`):

   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

4. Set `www` as a CNAME to `greatcoltini.github.io` (no repository path). Remove conflicting `www` records, but retain unrelated mail/TXT records. Both apex and www should resolve to GitHub Pages; GitHub redirects www to the configured apex domain.
5. Wait for DNS and certificate issuance, then enable **Enforce HTTPS** in Pages settings.
6. Verify HTTPS on `/`, `/games/`, `/projects/kingdom-td/`, and `/projects/boulderlog/`, direct nested loading, and the www-to-apex redirect. Verify unknown paths show the custom 404.

At implementation time, the nameservers were `dns1.registrar-servers.com` and `dns2.registrar-servers.com`, and the apex pointed to `162.255.119.107` (registrar forwarding). DNS changes require access to the registrar account; this project does not contain DNS credentials.

References: [Astro deployment](https://docs.astro.build/en/guides/deploy/github/) and [GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
