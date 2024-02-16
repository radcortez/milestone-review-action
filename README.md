# Milestone Review action

This action checks if the project has a Milestone and if all the issues associated with the Milestone are closed. The 
main purpose is to help with preparation for the project release:

- Does the project has a milestone for the version you want to release?
- Do you have any open issues in the project?

If the answer to any of these checks is *Yes*, then the action will submit a Pull Request review to fix the issue.

This action is only intended to run with Pull Request events.  

## Inputs

### `github-token`

**Required** The GitHub Token used to create an authenticated client. The Github Token is already set by the Github 
Action itself. Use this if you want to pass in your own Personal Access Token. 

**Default** `${{github.token}}`.

### `milestone-title`

**Required** The Milestone Title to search for in the Repository.

## Example usage

```yaml
- uses: radcortez/milestone-review-action@main
  name: milestone review
  with:
    github-token: ${{secrets.GITHUB_TOKEN}}
    milestone-title: '2.0.0'
```

Most likely you want for the `milestone-title` to be dynamic. You could retrieve the milestone title associated with 
your context, by querying something in your project that provides you that information and then pass it as a variable:

```yaml
- uses: radcortez/milestone-review-action@main
  name: milestone review
  with:
    github-token: ${{secrets.GITHUB_TOKEN}}
    milestone-title: ${{steps.version.outputs.project-version}}
```
