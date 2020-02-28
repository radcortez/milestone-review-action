const core = require('@actions/core');
const github = require('@actions/github');

try {
    const milestoneNumber = core.getInput('milestone-number');
    console.log(`Checking Milestone with number ${milestoneNumber}`);

    const octokit = new github.GitHub(core.getInput('github-token'));

    octokit.issues.getMilestone({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        milestone_number: milestoneNumber
    }).then(({data}) => {

        console.log(`Found Milestone ${data.title}`);

        if (data.open_issues > 0) {
            core.setFailed(`Milestone ${data.title} still has ${data.open_issues} open issues!`);
        } else {
            console.log(`Milestone has no issues open.`)
        }

    }).catch((error) => {
        if (error.status === 404) {
            core.setFailed(`Milestone with number ${milestoneNumber} Not Found!`);
        } else {
            console.debug(error);
            core.setFailed('Unknown Error!')
        }
    })

} catch (error) {
    core.setFailed(error.message);
}
