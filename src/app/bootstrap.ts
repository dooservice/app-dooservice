import { moduleRegistry } from '@/core'
import { AuthModule }         from '@/modules/auth/module'
import { AgentsModule }       from '@/modules/agents/module'
import { CompaniesModule }    from '@/modules/companies/module'
import { PlansModule }        from '@/modules/plans/module'
import { GithubModule }       from '@/modules/github/module'
import { ProjectsModule }     from '@/modules/projects/module'
import { EnvironmentsModule } from '@/modules/environments/module'
import { JobsModule }         from '@/modules/jobs/module'

export async function bootstrap(): Promise<void> {
  moduleRegistry.register(AuthModule)
  moduleRegistry.register(AgentsModule)
  moduleRegistry.register(CompaniesModule)
  moduleRegistry.register(PlansModule)
  moduleRegistry.register(GithubModule)
  moduleRegistry.register(ProjectsModule)
  moduleRegistry.register(EnvironmentsModule)
  moduleRegistry.register(JobsModule)
  await moduleRegistry.bootstrap()
}
