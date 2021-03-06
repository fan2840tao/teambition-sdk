import { Observable } from 'rxjs/Observable'
import { QueryToken } from 'reactivedb'

import { CacheStrategy } from '../../Net'
import { CustomFieldLinkSchema } from '../../schemas'
import { ProjectId, CustomFieldBoundType } from 'teambition-types'
import { SDK } from '../../SDK'
import { SDKFetch } from '../../SDKFetch'

export function getCustomFieldLinksFetch(
  this: SDKFetch,
  projectId: ProjectId,
  boundType: CustomFieldBoundType,
  { withRootCommongroup = true }: GetCustomFieldLinksOptions = {}
): Observable<CustomFieldLinkSchema[]> {
  return this.get<CustomFieldLinkSchema[]>(
    `projects/${projectId}/customfieldlinks`,
    { boundType, withRootCommongroup }
  )
}

declare module '../../SDKFetch' {
  interface SDKFetch {
    getCustomFieldLinks: typeof getCustomFieldLinksFetch
  }
}

SDKFetch.prototype.getCustomFieldLinks = getCustomFieldLinksFetch

export function getCustomFieldLinks(
  this: SDK,
  projectId: ProjectId,
  boundType: CustomFieldBoundType
): QueryToken<CustomFieldLinkSchema> {
  return this.lift<CustomFieldLinkSchema>({
    cacheValidate: CacheStrategy.Request,
    tableName: 'CustomFieldLink',
    request: this.fetch.getCustomFieldLinks(projectId, boundType),
    query: {
      where: { _projectId: projectId, boundType: boundType },
      orderBy: [
        { fieldName: 'pos', orderBy: 'ASC' }
      ],
    },
    assocFields: {
      locker: ['_id', 'name', 'avatarUrl']
    }
  })
}

declare module '../../SDK' {
  interface SDK {
    getCustomFieldLinks: typeof getCustomFieldLinks
  }
}

SDK.prototype.getCustomFieldLinks = getCustomFieldLinks

interface GetCustomFieldLinksOptions {
  withRootCommongroup?: boolean
}
