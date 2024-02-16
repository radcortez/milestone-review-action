const core = require('@actions/core');
const github = require('@actions/github');

try {
    const token = core.getInput('github-token');
    const ghOwner = github.context.repo.owner;
    const ghRepo = github.context.repo.repo;
    const pullRequestNumber = github.context.payload.pull_request.number;
    const milestoneTitle = core.getInput('milestone-title');
    console.log(`Checking Milestone ${milestoneTitle}`);

    const octokit = github.getOctokit(token);

    octokit.rest.issues.listMilestones({
        owner: ghOwner,
        repo: ghRepo,
        state: 'open',
    }).then(({data}) => {

        let milestone = data.find(function (milestone) {
            return milestone.title === milestoneTitle;
        });

        if (milestone == null) {
            console.log(`Milestone ${milestoneTitle} Not Found!`);
            octokit.rest.pulls.createReview({
                owner: ghOwner,
                repo: ghRepo,
                pull_number: pullRequestNumber,
                body: `Please add a Milestone for ${milestoneTitle}`,
                event: 'REQUEST_CHANGES'
            });
            return;
        }

        console.log(`Found Milestone ${milestone.title}`);

        if (milestone.open_issues > 0) {
            console.log(`Milestone ${milestone.title} still has ${milestone.open_issues} open issues!`);
            octokit.rest.pulls.createReview({
                owner: ghOwner,
                repo: ghRepo,
                pull_number: pullRequestNumber,
                body: `Milestone ${milestone.title} still has ${milestone.open_issues} open issues!`,
                event: 'REQUEST_CHANGES'
            });
        } else {
            console.log(`Milestone has no issues open.`);
            octokit.rest.pulls.createReview({
                owner: ghOwner,
                repo: ghRepo,
                pull_number: pullRequestNumber,
                event: 'APPROVE'
            });
        }

    }).catch((error) => {
        console.debug(error);
        core.setFailed('Unknown Error!')
    })

} catch (error) {
    core.setFailed(error.message);
}
