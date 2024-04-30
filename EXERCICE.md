# git-formation

**Goal**: Learn how to completely change your base's branch using the `--onto` option

This exercise assumes you understand how to do a `git rebase`.

This branch, `exo/rebase-onto`, is based on another branch, `exo/rebase-onto-oldbase`. Run `git log` to see what I mean.  
We want to change this branch's base to `main`, but while only keeping the commits of the `exo/rebase-onto` branch. We don't want to keep the commits in `exo/rebase-onto-oldbase`.

This little diagram shows you the current state of our branches, and what we want them to look like at the end of this exercise:

```
Before                                          After
A---B---C---D (main)                            A---B---C---D (main)
         \                                              |    \
          E---F (exo/rebase-onto-oldbase)                \     G'---H' (exo/rebase-onto)
               \                                          \
                 G---H (exo/rebase-onto)                    E---F (exo/rebase-onto-oldbase)
```

The `--onto` option when rebasing, along with the branch's old (current) base as an argument, allows us to tell git to only keep the current branch's commit and rebase them on top of another branch.  
Read below for more detailed explanation and a diagram to illustrate this.

Steps:

- rebase `exo/rebase-onto` onto `main` by using `git rebase --onto`. You need to provide two more arguments for this to work, figure out what they are.
- resolve conflicts as they come up
- run `git rebase --continue` between each commit to go to the next one
- run `git rebase --abort` to abandon the rebase if you mess up

When everything is done, run `git log` to check that you no longer have the commits from `exo/rebase-onto-oldbase`

Read below for an explanation

## What is `git rebase --onto`?

For the sake of example, imagine that you have the following branches: `main`, `dev` and `feature`.  
`dev` is based on `main`, `feature` is based on `dev`.

`feature`is a branch where you just fixed a bug. You realise the bug is present in the `main` branch as well, and you decide you want to apply `feature`'s commits on `main` to fix that bug in prod.

If you were to do a regular `git rebase`, you would apply not only `feature`'s commits, but ALSO `dev`'s commits on top of `main`.  
That is because when you run `git rebase main feature`, git will start by finding the most recent commit in common between `main` and `feature`.  
In this case, we have established `feature` is based on `dev`, and `dev` is based on `main`. If we try to find the most recent common ancestor between `main` and `feature`, it will probably be the base commit of the `dev` branch.  
Since the most recent commit in common is on the `dev` branch, the rebase would take every commit between that commit on `dev` and the tip of the `feature` branch, and replay them on `main`.

Sounds complicated? That's because it is. Have a look at this diagram:  
[rebase --onto diagram](https://drive.google.com/file/d/1kdBnIDt80mx3drkU4H-tmJKOOyVjym8k/view?usp=sharing)

As you can see, `git rebase --onto <newbase> <oldbase> <currentbranch>` (in the diagram, `git rebase --onto main dev feature`) does the following:

- find the common ancestor commit between `<currentbranch>` and `<oldbase>`. In the diagram, the common ancestor between `feature` and `dev` is the commit `F`
- take all the commits between the common ancestor commit (`F`) and the tip of `<currentbranch>` (`feature`), and replay them on `<newbase>`(`main`)
- prompt user to solve conflicts if there are any, do this for every commit.

## Further explanation

It's worth mentioning this is not the only way to use `--onto`. the `<newbase>` and `<oldbase>` arguments of `git rebase --onto` can be any commit. This means you can do this:  
`git rebase --onto D F`

```
Before                                    After
A---B---C---D---E (branch)                A---B---C---D---E (branch)
         \                                             \
          F---G---H---I (HEAD my-branch)                E'---H'---I' (HEAD my-branch)
```

In this case, you effectively removed the `F` commit from `my-branch`.  
This example was taken from [this article](https://womanonrails.com/git-rebase-onto). You can read it for more niche usecases.

It's also worth knowing that `git rebase --onto` and `git cherry-pick` share a lot of similarities.

In case you're not familiar with it, `git cherry-pick` lets you move a specified commit (or a range of specified commits) to another branch.  
In that sense, the use case is extremely similar to `git rebase --onto`, since in both cases you're trying to move commits from branch A to branch B, without taking a bunch of unwanted commits with you.

The difference, then, is that when you're using `git rebase --onto <newbase> <oldbase> <currentbranch>`, you're making changes to `<currentbranch>`. You're rebasing your commits on top of `<newbase>`, and applying potentially new commits from that new base.

When you're ruinning `git cherry-pick <commit-sha>~..<another-commit-sha> main`, you're applying all commits between `<commit-sha>` and `<another-commit-sha>` to the `main` branch. It doesn't matter what branch these commits came from, you're not changing anything on that branch, you're only making changes on the target branch: `main` here.

So while the use cases might be similar, in reality they do almost the opposite of one another!

Anyway it would take forever to effectively compare `cherry-pick` and `rebase --onto`, but the point is that they can achieve similar things, with various degrees of difficulty and nuance. Learn how to use both!
