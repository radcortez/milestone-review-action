const core = require('@actions/core');
const github = require('@actions/github');

try {
    const milestoneTitle = core.getInput('milestone-title');
    console.log(`Checking Milestone ${milestoneTitle}`);

    const octokit = new github.GitHub(core.getInput('github-token'));

    octokit.issues.listMilestonesForRepo({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        state: 'open',
    }).then(({data}) => {

        let milestone = data.find(function (milestone) {
            return milestone.title === milestoneTitle;
        });

        if (milestone == null) {
            console.log(`Milestone ${milestoneTitle} Not Found!`);
            octokit.pulls.createReview({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                pull_number: github.context.payload.pull_request.number,
                body: `Please add a Milestone for ${milestoneTitle}`,
                event: 'REQUEST_CHANGES'
            });
            return;
        }

        console.log(`Found Milestone ${milestone.title}`);

        if (milestone.open_issues > 0) {
            console.log(`Milestone ${milestone.title} still has ${milestone.open_issues} open issues!`);
            octokit.pulls.createReview({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                pull_number: github.context.payload.pull_request.number,
                body: `Milestone ${milestone.title} still has ${milestone.open_issues} open issues!`,
                event: 'REQUEST_CHANGES'
            });
        } else {
            console.log(`Milestone has no issues open.`);
            octokit.pulls.createReview({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                pull_number: github.context.payload.pull_request.number,
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
