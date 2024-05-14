# git-formation

In this formation, so far, we have used `git rebase` for the purpose of either manipulating your branch's history, or incoporating new commits from your branch's base.

But what happens when your base branch has been rewound\*?  
\* a branch that has been "rewound" is a branch whose history has been rewritten in some way. Whether a commit was deleted, the order of commits has changed, some commits were squashed...

Consider the following. When this branch (`exo/rebase-fork-point`) was created, our branch architecture looked like this:

```
A---B---C---D (main)
             \
              E---F (exo/rebase-fork-point)
```

However, we removed the `D` commit from the `main` branch later (by running something like `git reset --hard C`, where `C` is another commit of `main`). We then made another commit on main (`D'`)
Now our branches look like:

```
A---B---C---D' (main)
        \
         D---E---F (exo/rebase-fork-point)
```

That's right! We never removed the `D` commit from `exo/rebase-fork-point`, and that commit is not a part of `main` anymore.  
So now, as far as git knows, it's a part of `exo/rebase-fork-point`.

If we were to run `git rebase main exo/rebase-fork-point`, our branches would look like:

```
A---B---C---D' (main)
             \
              D---E---F (exo/rebase-fork-point)
```

Notice how the `D` commit is still there. We wanted to get rid of it, so this sucks!  
You could just delete the `D` commit in `exo/rebase-fork-point`, and then your branch's base would be "synchronized" with `main`....  
But... That means you need to remember the commit SHA, and you need to use `git rebase -i --keep-base`, or `git rebase --onto` to remove it. It's annoying.

Also, it might work here, but what if more commits were deleted? What if someone had run a rebase on the base branch, changing a bunch of commits SHAs?  
You would have to sift through `git log`, and probably `git reflog`, manually having to find where the branches diverged, which commits to drop, which commits to keep... It's a nightmare.

Which is where `git rebase --fork-point` comes in! The `--fork-point` option uses the reflog to find where the two branches have diverged. It then runs a rebase from that point, dropping any unwanted commits. More explanation below.

Run `git log`.  
The commit with the message `oops, accidentally commited a random file! I'll remove this later :clueless:` was originally part of `main` but was then removed, it corresponds to the `D` commit on the diagram.

We want to find a way to rebase `exo/rebase-fork-point` on `main` without keeping that commit.

Steps:

- run `git rebase --fork-point main`
- That's it really ¯\\\_(ツ)\_/¯

I really recommend you read on to understand when this option might be useful, and how it functions.

## When and why use `git rebase --fork-point`?

You should use `--fork-point` when you have edited your base branch in any way. This includes:

- when you have used `git reset` on it, specifically if the commits you removed this way were also in another branch
- when you run a rebase on your base branch. Really, any rebase that does anything, unless you're 100% certain it hasn't affected any commits present in other branches.

However these two use cases should ideally never happen.  
Rewinding a base branch is a terrible idea for many reasons, mainly since it requires extra work to "fix" the history.  
This is even worse if you rewind a public branch on a repo where multiple people work on. If anyone has work based on the branch you rewound, you will cause many history issues and conflicts.

Consider the second use case, when the base branch has been rebased. Imagine the following architecture:

```

A---B---C---D (main)
        \
         E---F (dev)
              \
                G---H (feature)
```

If you'd like to incorporate the changes from commit `D` into both the `dev` and `feature` branches, you might be tempted to just rebase `dev` on `main`, and then `feature` on `dev`.  
But that's a terrible idea. Here's why:

If you run `git rebase main dev`, your branches will look like this

```
A---B---C---D (main)
        |    \
         \    E'---F' (dev)
          \
           E---F---G---H (feature)
```

Again, notice how commits `E` and `F` didn't magically disappear from `feature`. Git doesn't know these commits originally belonged to `dev`, it **only knows they are on the `feature` branch**.  
Also notice how the commits on dev are named `E'` and `F'` here. This is to show that they have (roughly) the same content, but **_they do not have the same commit SHA, they are completely different commits!_**

If you then run `git rebase dev feature`, you would have this:

```
A---B---C---D (main)
             \
              E'---F' (dev)
                    \
                     E---F---G---H (feature)
```

Here you can see we kept the `E` and `F` commits, even though they are duplicates of the content in `E'` and `F'`.  
It might not break anything, but these _could_ introduce errors, conflicts, and they generally make your git history less clear.

If instead we had run `git rebase --fork-point dev feature`, we would have this:

```
A---B---C---D (main)
             \
              E'---F' (dev)
                    \
                     G---H (feature)
```

A better way to avoid this is to simply not rebase your base branch... ever! Until you're ready to merge it of course.  
It would make more sense to first merge `feature` into `dev`, and to then rebase `dev` on `main`.

If you absolutely need to incorporate changes from main before being ready to merge, you could just cherry-pick the commits into `dev`, then rebase `feature` on `dev`.  
Yes, that will also create "duplicate" commits, but it will most likely be less work, and will usually result in very few duplicated commits.

## How does `git rebase --fork-point` work?

This is less crucial to understand, but if you're curious, imagine this exercise's premise once more:

```
A---B---C---D (main)
             \
              E---F (exo/rebase-fork-point)
```

Where, once again, `D` was removed from main, and another commit `D'` was pushed, resulting in this:

```
A---B---C---D' (main)
        \
         D---E---F (exo/rebase-fork-point)
```

When we run `git rebase main exo/rebase-fork-point`, git will:

- find the common ancestor commit between `main` and `exo/rebase-fork-point` (here it is `C`)
- take all commits between the common ancestor (`C`) and the tip of the branch we are rebasing (`F`)
- replay all those commits on top of `main`
- check for conflicts etc etc

When we run `git rebase --fork-point main exo/rebase-fork-point`, git will:

- take every commit in the branch we are rebasing (`exo/rebase-fork-point`), starting from the tip (`F`)
- for every commit, use the reflog to check if that commit has ever been part of the branch we're rebasing on (`main`).
- once a commit that has been on the target branch (`main`) has been found, run the equivalent of a `git rebase --onto`, with the diverging commit as the old base, and the target branch as the new base.

Complicated, no? But pretty much, in our example:

- git will start from commit `F`, going backwards, and for each commit use the reflog to check if that commit was ever a part of `main`
  - Here, git will see that `F` and `E` were never part of `main`.
- git will find that `D` was once a part of main, it marks it as the first divergent commit (the "fork point", literally)
- git will then run the equivalent of `git rebase --onto D main`. We consider that `D` is the "old base", and the "new base" is `main`.
  - This will effectively remove the `D` commit, and every commit behind it that isn't part of the `main` branch, before rebasing on top of `main`. This is exactly what we want.
