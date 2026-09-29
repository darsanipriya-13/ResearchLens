<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- ResearchLens uses mock data in src/data and stub services in src/services; UI reads only typed data (src/types) so real APIs can replace services without UI changes.
- App state (current search, history, compare list) lives in src/lib/store.tsx context persisted to localStorage — no backend yet.
