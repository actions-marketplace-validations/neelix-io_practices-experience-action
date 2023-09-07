import * as core from '@actions/core';



const durationInRange = (durationInDays: number, timeToMerge: string) => {
  core.info(`incoming timeToMerge: ${timeToMerge}`);
  core.info(`incoming durationInDays: ${durationInDays}`);

  if (!timeToMerge) {
    return true;
  }

  if (isNaN(durationInDays)) {
    return false;
  }

  const [lowerLimit, upperLimit] = timeToMerge.split(',').map(l => +l);

  if (!isNaN(lowerLimit) && durationInDays < lowerLimit) {
    core.info(`PR duration ${durationInDays} not gte ${lowerLimit}`)
    return false;
  }

  if (!isNaN(upperLimit) && durationInDays > upperLimit) {
    core.info(`PR duration ${durationInDays} not lte ${upperLimit}`)
    return false;
  }

  core.info(`PR duration ${durationInDays} is within ${lowerLimit} and ${upperLimit}`)
  return true;
}

const commitsInRange = (commitCount: number, commitRange: string) => {
  core.info(`incoming commitCount: ${commitCount}`);
  core.info(`incoming commitRange: ${commitRange}`);

  if (!commitRange) {
    return true;
  }

  if (isNaN(commitCount)) {
    return false;
  }

  const [lowerLimit, upperLimit] = commitRange.split(',').map(l => +l);

  if (!isNaN(lowerLimit) && commitCount < lowerLimit) {
    core.info(`PR commit count ${commitCount} not gte ${lowerLimit}`)
    return false;
  }

  if (!isNaN(upperLimit) && commitCount > upperLimit) {
    core.info(`PR commit count ${commitCount} not lte ${upperLimit}`)
    return false;
  }

  core.info(`PR commits ${commitCount} within ${lowerLimit} and ${upperLimit}`)
  return true;
}

const changesInRange = (changeCount: number, changeRange: string) => {
  core.info(`incoming commitCount: ${changeCount}`);
  core.info(`incoming commitRange: ${changeRange}`);

  if (!changeRange) {
    return true;
  }

  if (isNaN(changeCount)) {
    return false;
  }

  const [lowerLimit, upperLimit] = changeRange.split(',').map(l => +l);

  if (!isNaN(lowerLimit) && changeCount < lowerLimit) {
    core.info(`PR change count ${changeCount} not gte ${lowerLimit}`)
    return false;
  }

  if (!isNaN(upperLimit) && changeCount > upperLimit) {
    core.info(`PR change count ${changeCount} not lte ${upperLimit}`)
    return false;
  }

  core.info(`PR changes ${changeCount} within ${lowerLimit} and ${upperLimit}`)
  return true;
}

const run = async () => {
  try {
    const durationInDays = +core.getInput('duration-in-days');
    const timeToMerge = core.getInput('time-to-merge-condition');

    const durationOK = durationInRange(durationInDays, timeToMerge);

    const additionalCommits = +core.getInput('additional-commits');
    const additionalCommitsCondition = core.getInput('additional-commits-condition');

    const commitsOK = commitsInRange(additionalCommits, additionalCommitsCondition);

    const totalChanges = +core.getInput('total-changes');
    const totalChangesCondition = core.getInput('total-changes-condition');

    const changesOK = changesInRange(totalChanges, totalChangesCondition);

    core.setOutput('satisfied', durationOK && commitsOK && changesOK);
  } catch (err) {
    let error: string | Error = 'Unknown error';
    if (typeof err === 'string') {
      error = err;
    } else if (err instanceof Error) {
      error = err;
    } else if (err && typeof err === 'object' && 'message' in err) {
      error = JSON.stringify(err.message);
    }
    core.setFailed(error);
  }
}

run();