# game
## 개요
숭실대학교 미디어앤테크 수업의 팀플레이 과제의 코드를 관리하는 Repository입니다. <br />
[p5.js](https://p5js.org) 를 활용하여 게임을 개발합니다.

## 환경설정
### bun.js 설치
```shell
$ curl -fsSL https://bun.sh/install | bash # Linux & macOS
$ powershell -c "irm bun.sh/install.ps1 | iex" # Windows
```

### 의존성 패키지 설치
```shell
$ bun install
```

### 실행
```shell
$ bun dev
```

## 코드 관리
### Git-flow
[Git-flow](https://techblog.woowahan.com/2553) 기법으로 코드를 관리합니다. <br />
아래 Prefix만 사용하여 branch를 관리합니다.
```text
- master(모든 기능이 개발완료 되었을 때, develop에서 merge)
- develop(각자의 작업물이 병합되는 branch, feature/refactor에서 merge)
- feature(기능 개발의 최소 단위)
- refactor(기능 개선/수정 및 기타 기능 개발의 최소 단위)
```
e.g. `feature/add-full-animation`, `refactor/fix-few-issue`

### Pull Request
모든 branch는 develop으로 병합할 때, 공동 작업자의 Review를 받습니다.