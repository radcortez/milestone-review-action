const core = require('@actions/core');
const github = require('@actions/github');

try {
    const octokit = new github.GitHub(core.getInput('github-token'));

    const milestoneNumber = core.getInput('milestone-number');
    console.log(`Checking ${milestoneNumber}`);

    octokit.issues.getMilestone({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        milestone_number: milestoneNumber
    }).then(({data}) => {

        console.log(`Found Milestone ${data.title}`);

        if (data.open_issues > 0) {
            core.setFailed(`Milestone ${milestoneNumber} still has ${data.open_issues} open issues!`);
        }

        console.log(`Milestone has no issues open.`)

    }).catch((error) => {
        if (error.status === 404) {
            core.setFailed(`Milestone ${milestoneNumber} Not Found!`);
        } else {
            console.debug(error);
            core.setFailed('Unknown Error!')
        }
    })

} catch (error) {
    core.setFailed(error.message);
}
