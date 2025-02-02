/**********************************************************************
 * Copyright (c) 2022 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/

import { GithubUrl } from './github-url';
import { injectable } from 'inversify';

/**
 * Provides a github URL object allowing to interact
 */
@injectable()
export class GithubResolver {
  // eslint-disable-next-line max-len
  static readonly GITHUB_URL_PATTERN =
    /^(?<scheme>https?):\/\/(?<host>github(\..+)?\.[^\/]+)\/(?<repoUser>[^\/]+)\/(?<repoName>[^\/]+)((\/)|\/(blob|tree)\/(?<branchName>[^\/]+)(?:\/(?<subFolder>.*))?)?$/;

  resolve(link: string): GithubUrl {
    const match = GithubResolver.GITHUB_URL_PATTERN.exec(link);
    if (!match) {
      throw new Error(`Invalid github URL: ${link}`);
    }
    const scheme = this.getGroup(match, 'scheme');
    const hostName = this.getGroup(match, 'host');
    const repoUser = this.getGroup(match, 'repoUser');
    const repoName = this.getGroup(match, 'repoName');
    const branchName = this.getGroup(match, 'branchName', 'HEAD');
    const subFolder = this.getGroup(match, 'subFolder');
    return new GithubUrl(scheme, hostName, repoUser, repoName, branchName, subFolder);
  }

  getGroup(match: RegExpExecArray, groupName: string, defaultValue?: string) {
    if (match.groups && match.groups[groupName]) {
      return match.groups[groupName];
    }
    return defaultValue || '';
  }
}
