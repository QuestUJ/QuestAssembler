# Github workflow
Few simple rules:
- `main`- is protected and used only for major releases and deployment (no force pushes deletions etc)
- `dev` - is protected and represents current development state, every branch originates from this branch and every change is merged to this through pull request (no force pushes deletions etc)
- `"feature-branches"` - other branches used by single contributor so here force pushes, rebases etc. are allowed, but we don't commit to other peoples' branches.