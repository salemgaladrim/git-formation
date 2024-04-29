# git-formation

**Goal**: Learn how to use the `edit` option in interactive rebases

What happens if you made a mistake in a previous commit that you now have to fix?

Most people's instincts would be to make a new commit that fixes that mistake. And in most cases that's exactly what you should do; it allows your git history to remain clean, you don't deal with conflicts etc...

> Read up on `git revert` to learn how to "undo" entire commits this way

However sometimes, you want to remove a mistake from your history. What if you accidentally pushed a `.env` file for example? Well that's the exact scenario of this branch!

There are a bunch of commits in this branch. At some point in the branch's history, a `.env` file was pushed. You need to find the exact commit it was pushed to, then use `git rebase -i` to remove the file from your history.

Steps:

- First, find the commit the file was pushed in using `git log --follow`
- Then, use `git rebase -i` with the `edit` option to edit the commit
- Use `git rm --cached` on the `.env` file, and `git add` it to remove it from your commit
- Run `git commit --amend`
- Continue rebasing with `git rebase --continue`

Every detail you need to complete this exercise is present in the little menu that appears when you run `git rebase -i`.

## What is an interactive rebase?

Go read this section in `exo/rebase-interactive-fixup` if you're unfamiliar with interactive rebases

## What are the use cases for this?

I would only ever recommend editing a commit if you are beyond certain that the changes you are removing or adding do NOT impact any commits that come after it.

Use cases could be:

- accidentally pushing a file you should never push
- either adding an irrelelvant file into a commit, or forgetting to add a relevant file to a commit
- changing something like a README.md file, something you know for a fact will not have an impact on anything else

Keep in mind these are extremely niche use cases. They are ALWAYS results of you making a poor decision somewhere in your workflow.  
But that's okay, mistakes are humans, and we're learning how to fix these mistakes today.

Also keep in mind there are much better ways of fully removing accidentally pushed secrets from your repo.  
Read more here: [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

## Why is this dangerous?

Removing changes from your history is always somewhat risky. Since every subsequent commit depends on the previous, removing information means the following commits are potentially incoherent.

These incoherent commits will not always be picked up by git as well. Say that you add a config file in commit A, then use the parameters in that config file in other files added to commit B. If you remove commit A entirely, commit B will obviously not work.  
But git has no way of knowing that. The code in commit A and commit B are entirely independent of one another. There will be no conflicts and no warnings.

This is why knowing what you're doing is so incredibly important when editing your history. You have to be familiar with the changes you are making, you need to know if the code you are modifying is used somewhere else.  
If you don't know what you're doing, just make those changes in a new commit.

If you mess up somewhere, remember: you can always undo every change you have made using `git reflog` and `git reset`!
