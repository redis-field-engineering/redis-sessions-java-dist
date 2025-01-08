# Redis Sessions Java Example

This is an example project demonstrating the usage of the Redis Sessions Java library. 

## How to Run

### In Docker

If you want to run the whole thing within docker (the project itself as well as the accompanying services) you may do so using:

```shell
# ensure you have jdk 17+ installed, ex with sdkman
# sdk install java 17.0.13-amzn

# ensure you have maven if needed
# brew install maven

mvn package
docker compose up
```

### Remotely

To run the app remotely, we have terraform for aws & gcp. To use them simply cd to your preferred platform, create a .tfvars file using `mv .tfvars.example .tfvars`, fill in the appropriate settings and then run the following:

```bash
terraform init
terraform plan -var-file=.tfvars
terraform apply -var-file=.tfvars --auto-approve
```

It will take some time to build (after the resource are created) but it will be deployed to `bookstore.your.subdomain.tld`

### Locally

To run this project you must first install the required jars locally:

```bash
mvn install:install-file \
   -Dfile=jars/redis-enterprise-sessions-spring-1.0-SNAPSHOT.jar \
   -DgroupId=redis.enterprise.sessions \
   -DartifactId=redis-enterprise-sessions-spring \
   -Dversion=1.0-SNAPSHOT \
   -Dpackaging=jar \
   -DgeneratePom=true


mvn install:install-file \
   -Dfile=jars/redis-enterprise-sessions-core-1.0-SNAPSHOT-jar-with-dependencies.jar \
   -DgroupId=redis.enterprise.sessions \
   -DartifactId=redis-enterprise-sessions-core \
   -Dversion=1.0-SNAPSHOT \
   -Dpackaging=jar \
   -DgeneratePom=true
```

At which point you may spin up the required services using docker:

```bash
docker compose -f docker-compose-ide.yml up
```

After which you may run the app either directly from your IDE or as a simple jar command after packaging:

```shell
mvn package
java -jar target/test-sessions-0.0.1-SNAPSHOT.jar --spring.profiles.active=docker
```