# git-formation

# git-sandbox

## Undo your terrible, terrible mistakes

**Goal**:
Learn how to restore a commit you previously lost

In this exercise, we are going to lose access to a non-pushed commit that we just made. We will then learn how to gain access to that commit again.

**Instructions**:

- Make a change to `awesome-script.js` and commit it. Give it a distinct message. **_DO NOT PUSH YOUR COMMIT_**
- Run the following command: `git reset --hard HEAD~5`. You have now moved the branch to 5 commits behind `HEAD`, losing your non-pushed commit in the process.
- However, most things are never truly lost with git. Use `git reflog`, see what you can find.
- Once you have found what you need, run `git reset --hard` again with the commit SHA to restore the commit!

**Explanations**:

<details>
    <summary>Spoilers!</summary>

What is `git reflog`?
First understand that `HEAD`, and branches are known as "refs" in git. Refs are just pointers to a commit.
The `reflog`, then, as the name suggests, keeps track of **all activity of all refs across your repo**.

When `HEAD` moves to a commit, or when a branch changes (new commit, a reset etc), that activity can be found along with the corresponding commit SHA in `git reflog`.

Normally, if you screw up your history, you should be able to `git reset --hard origin/<your-branch>`.

However, this will only reset you to the state of your remote repo, NOT the state your local repo was in before. You would lose any un-pushed commits by doing so.

</details>
